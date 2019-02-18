import React from "react";
import _ from "lodash";

//Styles
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { withRouter } from "react-router-dom";

//Material UI Components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

//Custom Components
import MiTabla from "@Componentes/MiTabla";
import MiCedulon from "@Componentes/MiCedulon";
import MiMercadoPago from "@Componentes/MiMercadoPago";
import MiInterBanking from "@Componentes/MiInterBanking";
import MisBeneficios from "@Componentes/MisBeneficios";
import { checkBeneficios } from "@Componentes/MisBeneficios";
import MiControledDialog from "@Componentes/MiControledDialog"
import Button from "@material-ui/core/Button";

//Funciones Útiles
import { stringToFloat, formatNumber, getIdTipoTributo, mostrarAlerta } from "@Utils/functions"

import { mostrarCargando } from '@Redux/Actions/mainContent';

//Services
import services from '@Rules/Rules_TributarioOnline';

const mapStateToProps = state => {
  return {
    loggedUser: state.Usuario.loggedUser,
    tipoTributos: state.MainContent.tipoTributos,
  };
};

const mapDispatchToProps = dispatch => ({
  redireccionar: url => {
    dispatch(push(url));
  },
  mostrarCargando: (cargar) => {
    dispatch(mostrarCargando(cargar));
  },
});

class MisPagosDetalle extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      importeAPagar: '0,00',
      recargoAPagar: '0,00',
      deduccionAPagar: '0,00',
      rowList: this.props.info ? this.props.info.rowList : [],
      tableDisabled: this.props.disabled || false,
      registrosSeleccionados: this.props.registrosSeleccionados,
      tieneBeneficio: false,
      beneficioKey: {
        key: 0,
        version: (new Date()).getTime()
      },
      revisionBeneficios: {
        arrayTextoBeneficios: undefined,
        modal: {
          open: false
        }
      },
      beneficiosDisponibles: [],
      descuentoBeneficio: 0
    };
  }

  componentDidMount() {
    this.verificarTributoSeccionTieneBeneficio();
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.info && JSON.stringify(nextProps.info) != JSON.stringify(this.props.info)) {
      this.setState({ rowList: nextProps.info ? nextProps.info.rowList : [] });
    }

    if (JSON.stringify(nextProps.registrosSeleccionados) != JSON.stringify(this.props.registrosSeleccionados)) {
      this.setState({ registrosSeleccionados: nextProps.registrosSeleccionados });
    }
  }

  //Totalizador de importe de filas seleccionadas
  getFilasSeleccionadas = (filas, idFilasSeleccionadas) => {
    const descuentoBeneficio = stringToFloat(this.state.descuentoBeneficio) || 0;

    let registrosSeleccionados = []

    let importeTotal = 0;
    let recargoTotal = 0;
    let deduccionTotal = 0;
    filas.map((item) => {
      importeTotal += parseFloat(idFilasSeleccionadas.indexOf(item.id) != -1 ? stringToFloat(item['importe']) : 0);
      recargoTotal += parseFloat(idFilasSeleccionadas.indexOf(item.id) != -1 ? stringToFloat(item['data'].importe.recargo) : 0);
      deduccionTotal += parseFloat(idFilasSeleccionadas.indexOf(item.id) != -1 ? stringToFloat(item['data'].importe.deduccion) : 0);

      if (idFilasSeleccionadas.indexOf(item.id) != -1)
        registrosSeleccionados.push(item['concepto']);
    });

    this.props.setRegistrosSeleccionados &&
      this.props.setRegistrosSeleccionados(this.props.menuItemSeleccionado, registrosSeleccionados);

    importeTotal = descuentoBeneficio ? stringToFloat(importeTotal) - stringToFloat(descuentoBeneficio) : importeTotal;
    deduccionTotal = descuentoBeneficio ? stringToFloat(deduccionTotal) + stringToFloat(descuentoBeneficio) : deduccionTotal;

    this.setState({
      importeAPagar: formatNumber(importeTotal),
      recargoAPagar: formatNumber(recargoTotal),
      deduccionAPagar: formatNumber(deduccionTotal),
      registrosSeleccionados: registrosSeleccionados
    });
  };

  condicionFilasTabla = (params, callback) => {
    //CONDICIÓN: No debe permitir superar los 7 digitos (excepto en Comercio)
    const tributo = this.props.tributoActual;
    const idTipoTributo = getIdTipoTributo(tributo);
    let newDataRows = _.cloneDeep(params.rows);
    let importeTotal = 0;
    
    //Calculamos el total
    newDataRows.map((item) => {
      importeTotal += parseFloat(params.rowsSetSelected.indexOf(item.id) != -1 ? stringToFloat(item['importe']) : 0);
    });

    if (importeTotal >= 10000000 && idTipoTributo != this.props.tipoTributos.byValue['Comercio']) {
      mostrarAlerta('Para generar generar el cedulon o realizar un pago, el monto total no puede superar los $9.999.999');

      if (params.lastClickedRow) { //Cuando se preciona una fila en particular
        var currentRow = _.find(newDataRows, { id: params.lastClickedRow.id });

        currentRow.data.checked = false;

        const rowsSetSelected = _.filter(params.rowsSetSelected,function(ele){
            return ele != currentRow.id;
        });

        this.setState({
          rowList: newDataRows
        }, () => {
          callback({
            rows: newDataRows,
            rowsSetSelected: rowsSetSelected
          });
        });

      } else {
        newDataRows.map(n => {
          n.data.checked = false;
        });

        this.setState({
          rowList: newDataRows
        }, () => {
          callback({
            rows: newDataRows,
            rowsSetSelected: []
          });
        });
      }

    } else {
      callback({
        rows: params.rows,
        rowsSetSelected: params.rowsSetSelected
      });
    }
  }

  handleBeneficiosResult = (result) => {
    //Seteamos las nuevas rows con sus nuevas configuraciones de acuerdo a los beneficios y la tabla
    this.setState({
      ...this.state,
      tableDisabled: result.tableDisabled || false,
      rowList: result.rowList,
      tieneBeneficio: result.beneficio ? true : false
    });

    const descuento = result.beneficio ? this.getDescuentoBeneficio() : 0;

    this.setState({
      descuentoBeneficio: descuento
    }, () => {
      //Actualización grilla
      this.getFilasSeleccionadas(result.rowList, result.rowsSelected);
    });
  }

  getDescuentoBeneficio = () => {
    const datosCuenta = this.props.datosCuenta;
    if (!datosCuenta) return 0;

    return datosCuenta[6] ? stringToFloat(datosCuenta[6].split('$')[1]) : 0;
  }

  handleCalculoTotalCedulon = (resultBeneficios, callback) => {
    this.props.mostrarCargando(true);

    const { identificadorActual, tipoCedulon, tributoActual } = this.props;
    const token = this.props.loggedUser.token;

    const idTipoTributo = getIdTipoTributo(tributoActual);
    const periodosBeneficio = _.filter(resultBeneficios.rowList, (o) => { return resultBeneficios.rowsSelected.indexOf(o.id) != -1 });
    const periodos = _.map(periodosBeneficio, 'concepto');

    services.getReporteCedulon(token,
      {
        "tipoTributo": parseInt(idTipoTributo),
        "identificador": identificadorActual,
        "opcionVencimiento": 0,
        "periodos": periodos,
        "tipoCedulon": tipoCedulon,
        "esPagoElectronico": false,
        "esCuotaGlobal": true,
      })
      .then((datos) => {
        const resultData = datos.return;

        callback(resultData.totalCedulon || 0);
        this.props.mostrarCargando(false);
      })
      .catch((err) => { 
        console.log(err);
        this.props.mostrarCargando(false);
      });
  }

  //Una vez que precionamos Cedulon o PagoOnline, chequeamos si las filas seleccionadas pertenecen a algun beneficio vigente
  chekearBeneficios = (callback) => {
    const tipoTributo = this.props.tributoActual;
    const seccion = this.props.tipoCedulon;
    const selectedRows = this.state.registrosSeleccionados;

    //Si seleccionBeneficios = True quiere decir que encontró:
    //Más de un beneficio
    //O un beneficio/s con otro periodo más que no pertenece al mismo
    //Si seleccionBeneficios = False se ve tieneBeneficio (True/False) de acuerdo si coinciden con un beneficio o no
    const resultCheckBeneficio = checkBeneficios(tipoTributo, seccion, selectedRows);

    if (resultCheckBeneficio.seleccionBeneficios) {
      //En caso que:
      //Más de un beneficio
      //O un beneficio/s con otro periodo más que no pertenece al mismo
      //Preguntaremos que si quiere aplicar algún beneficio

      let arrayTextoSeleccionBeneficio = [];
      _.each(resultCheckBeneficio.arrayResultBeneficios, (beneficio, index) => {
        arrayTextoSeleccionBeneficio.push(<div>
          Dentro de los períodos seleccionados se encuentran: {beneficio.rows.join(', ')}.
          Los cuales pertenecen al beneficio <b>{beneficio.beneficio.titulo}</b>, desea aplicar el descuento?
          <Button
            variant="contained"
            color="secondary"
            size="small"
            style={{
              background: '#ffa114',
              borderRadius: '20px',
              marginLeft: '10px',
              minHeight: '22px',
              lineHeight: '11px',
            }}
            keyBeneficio={beneficio.beneficio.key}
            onClick={this.selectBeneficio}
          >
            Aplicar
          </Button>
          <br />
          <span style={{ color: 'red', fontSize: '12px', position: 'relative', top: '-8px' }}>(Recuerde que los periodos que quedan fuera del beneficio deberán ser pagados aparte)</span>
          {!index == (resultCheckBeneficio.arrayResultBeneficios.length - 1) && <div><br /><br /></div>}</div>);
      });

      this.setState({
        revisionBeneficios: {
          ...this.state.revisionBeneficios,
          arrayTextoBeneficios: arrayTextoSeleccionBeneficio
        }
      }, () => {
        this.onRevisionBeneficiosDialogoOpen();
      });

    } else {
      const tieneBeneficio = resultCheckBeneficio.tieneBeneficio;
      //tieneBeneficio True o False, continuamos el cedulon o pago online con beneficio (o no)
      this.setState({
        tieneBeneficio: tieneBeneficio,
        descuentoBeneficio: tieneBeneficio ? this.state.descuentoBeneficio : 0
      }, () => {
        //Seguimos con la acción del boton
        callback(tieneBeneficio);
      });
    }
  }

  verificarTributoSeccionTieneBeneficio = () => {
    const tipoTributo = this.props.tributoActual;
    const seccion = this.props.tipoCedulon;
    const selectedRows = _.map(this.state.rowList, 'concepto');

    const resultCheckBeneficio = checkBeneficios(tipoTributo, seccion, selectedRows);

    this.setState({
      beneficiosDisponibles: resultCheckBeneficio.arrayResultBeneficios || []
    });
  };

  selectBeneficio = (event) => {
    const key = event.currentTarget.attributes.keyBeneficio.value;

    this.setState({
      beneficioKey: {
        key: parseInt(key),
        version: (new Date()).getTime()
      }
    }, () => {
      this.onRevisionBeneficiosDialogoClose();
    });
  }

  onRevisionBeneficiosDialogoOpen = () => {
    this.setState({
      revisionBeneficios: {
        ...this.state.revisionBeneficios,
        modal: {
          ...this.state.revisionBeneficios.modal,
          open: true
        }
      }
    });
  }

  onRevisionBeneficiosDialogoClose = () => {
    this.setState({
      revisionBeneficios: {
        ...this.state.revisionBeneficios,
        modal: {
          ...this.state.revisionBeneficios.modal,
          open: false
        }
      }
    });
  }

  render() {
    const classes = this.props.classes;

    //deudaAdministrativa ó deudaJuicio contienen los mismos valores pero vienen en diferentes atributos
    //Puede venir una u otra, no las dos juntas
    const deudaTotales = this.props.info ? this.props.info.deudaAdministrativa || this.props.info.deudaJuicio : null;

    let valoresDeuda = {
      valor1: deudaTotales && deudaTotales.total ? deudaTotales.total : 0,
      valor2: (deudaTotales && (deudaTotales.vencida ? deudaTotales.vencida : deudaTotales.capital)) || 0,
      valor3: (deudaTotales && (deudaTotales.aVencer ? deudaTotales.aVencer : deudaTotales.gastos)) || 0,
    }

    //Datos para generar la grilla
    const rowList = this.state.rowList;
    const registrosSeleccionados = this.state.registrosSeleccionados;
    const rowsPerPage = (rowList.length <= 5 && 5) || (rowList.length > 5 && rowList.length <= 10 && 10) || (rowList.length > 10 && 25);
    const columnas = this.props.data.labels.columnas || null;
    const order = this.props.data.order || 'asc';
    const orderBy = this.props.data.orderBy || 'concepto';
    const check = this.props.check;
    const disabled = this.state.tableDisabled;
    const revisionBeneficios = this.state.revisionBeneficios;
    const beneficioKey = this.state.beneficioKey;
    const beneficiosDisponibles = this.state.beneficiosDisponibles;

    //Tributo y tipo de tributo para generar el cedulon
    const tributo = this.props.tributoActual;
    let tipoTributo = getIdTipoTributo(tributo);

    //Determinamos si el Cedulon tiene que estar deshabilitado
    let disabledCedulon = !(stringToFloat(this.state.importeAPagar) > 0);

    //En caso de ser juicio cambia cedulon siempre habilitado y 
    //el monto a pagar se setea el total (ya q la grilla no tiene checks)
    const esJuicio = this.props.menuItemSeleccionado == 'juicios';
    let auxImporteAPagar;
    let auxRecargoAPagar;
    let auxDeduccionAPagar;
    if (esJuicio) {
      disabledCedulon = false;
      auxImporteAPagar = 0;
      auxRecargoAPagar = 0;
      auxDeduccionAPagar = 0;
      rowList.map((item) => {
        auxImporteAPagar += stringToFloat(item['importe'], 2);
        auxRecargoAPagar += stringToFloat(item['data'].importe.recargo, 2);
        auxDeduccionAPagar += stringToFloat(item['data'].importe.deduccion, 2);
      });

      auxImporteAPagar = formatNumber(auxImporteAPagar);
      auxRecargoAPagar = formatNumber(auxRecargoAPagar);
      auxDeduccionAPagar = formatNumber(auxDeduccionAPagar);
    }

    const pagination = this.props.paraMobile ? false : (this.state.tieneBeneficio ? false : true);

    return <div>
      <Grid container className={classes.containerDeudaAdm}>
        {/* Totalizadores */}
        <Typography className={classes.tituloDeudaAdm} variant="title" gutterBottom>Deuda {this.props.data.labels.totalesDeuda}</Typography>
        <Grid item sm={4} className={"itemTotales"}>
          <Grid container>
            <Grid item sm={6}>
              <Typography variant="subheading" gutterBottom>Total: </Typography>
            </Grid>
            <Grid item sm={6}>
              <Typography variant="subheading" gutterBottom><b>$ {formatNumber(valoresDeuda.valor1)}</b></Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={4} className={"itemTotales"}>
          <Grid container>
            <Grid item sm={6}>
              <Typography variant="subheading" gutterBottom>{this.props.data.labels.vencida}: </Typography>
            </Grid>
            <Grid item sm={6}>
              <Typography variant="subheading" gutterBottom><b>$ {formatNumber(valoresDeuda.valor2)}</b></Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={4} className={"itemTotales"}>
          <Grid container>
            <Grid item sm={6}>
              <Typography variant="subheading" gutterBottom>{this.props.data.labels.aVencer}: </Typography>
            </Grid>
            <Grid item sm={6}>
              <Typography variant="subheading" gutterBottom><b>$ {formatNumber(valoresDeuda.valor3)}</b></Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={16}>
        {/* Totalizador de deudas seleccionadas y botones de pago */}
        <Grid item sm={4} className={classNames(classes.inputTotalPeriodos, "inputTotalPeriodos")}>
          <TextField
            id="standard-full-width"
            label={<span className={classes.textoTotalAPagar}>Total a pagar</span>}
            style={{ margin: 8 }}
            placeholder="0,00"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            className={classes.totalAPagar}
            value={auxImporteAPagar ? auxImporteAPagar : this.state.importeAPagar}
          />
          <div className={classNames(classes.contentRecargoDeduccion, classes.contentRecargoDeduccionTop)}>{auxRecargoAPagar ? <span className={classes.totalRecargoDeduccion}>(Recargo: {auxRecargoAPagar})</span> : <span className={classes.totalRecargoDeduccion}>(Recargo: {this.state.recargoAPagar})</span>} {auxDeduccionAPagar ? <span className={classes.totalRecargoDeduccion}>(Deducción: {auxDeduccionAPagar})</span> : <span className={classes.totalRecargoDeduccion}>(Deducción: {this.state.deduccionAPagar})</span>}</div>
        </Grid>
        <Grid item sm={8} className={classNames(classes.buttonActionsContent, "buttonActionsContent")}>

          <MisBeneficios
            beneficiosDisponibles={beneficiosDisponibles}
            tipoTributo={this.props.tributoActual}
            seccion={this.props.tipoCedulon}
            rows={rowList}
            handleBeneficiosResult={this.handleBeneficiosResult}
            seleccionBeneficioByKey={beneficioKey} />

          <MiCedulon
            tieneBeneficio={this.state.tieneBeneficio}
            registrosSeleccionados={registrosSeleccionados}
            subItemSeleccionado={this.props.info.identificador}
            tipoCedulon={this.props.tipoCedulon}
            tipoTributo={tipoTributo}
            identificador={this.props.identificadorActual}
            disabled={disabledCedulon}
            esJuicio={esJuicio}
            onClick={this.chekearBeneficios}
          />

          <MiMercadoPago
            tieneBeneficio={this.state.tieneBeneficio}
            pagoRedirect={this.props.pagoRedirect}
            idBtnMercadoPago={this.props.menuItemSeleccionado + "1"}
            seccionDetalleTributo={this.props.menuItemSeleccionado}
            registrosSeleccionados={registrosSeleccionados}
            subItemSeleccionado={this.props.info.identificador}
            tipoCedulon={this.props.tipoCedulon}
            tipoTributo={tipoTributo}
            identificador={this.props.identificadorActual}
            disabled={disabledCedulon}
            esJuicio={esJuicio}
            onClick={this.chekearBeneficios}
          />

          <MiInterBanking
            tieneBeneficio={this.state.tieneBeneficio}
            registrosSeleccionados={registrosSeleccionados}
            subItemSeleccionado={this.props.info.identificador}
            tipoCedulon={this.props.tipoCedulon}
            tipoTributo={tipoTributo}
            identificador={this.props.identificadorActual}
            disabled={disabledCedulon}
            esJuicio={esJuicio}
            onClick={this.chekearBeneficios}
          />

        </Grid>
      </Grid>

      {/* Tabla de detalle del tributo */}
      <MiTabla
        checkCondicion={this.condicionFilasTabla}
        pagination={pagination}
        columns={[
          { id: 'concepto', type: 'string', numeric: false, disablePadding: false, label: (columnas ? columnas[0] : 'Concepto') },
          { id: 'vencimiento', type: 'date', numeric: false, disablePadding: false, label: (columnas ? columnas[1] : 'Vencimiento') },
          { id: 'importe', type: 'string', numeric: true, disablePadding: false, label: (columnas ? columnas[2] : 'Importe ($)') },
          { id: 'detalle', type: 'custom', numeric: false, disablePadding: true, label: 'Detalle' },
        ]}
        rows={rowList || []}
        order={order}
        orderBy={orderBy}
        getFilasSeleccionadas={this.getFilasSeleccionadas}
        registrosSeleccionados={registrosSeleccionados}
        check={check}
        disabled={disabled}
        rowsPerPage={rowsPerPage}
      />

      <Grid container spacing={16}>
        {/* Totalizador de deudas seleccionadas y botones de pago */}
        <Grid item sm={4} className={classNames(classes.inputTotalPeriodos, "inputTotalPeriodos")}>
          <TextField
            id="standard-full-width"
            label={<span className={classes.textoTotalAPagar}>Total a pagar</span>}
            style={{ margin: 8 }}
            placeholder="0,00"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            className={classes.totalAPagar}
            value={auxImporteAPagar ? auxImporteAPagar : this.state.importeAPagar}
          />
          <div className={classNames(classes.contentRecargoDeduccion, classes.contentRecargoDeduccionBottom)}>{auxRecargoAPagar ? <span className={classes.totalRecargoDeduccion}>(Recargo: {auxRecargoAPagar})</span> : <span className={classes.totalRecargoDeduccion}>(Recargo: {this.state.recargoAPagar})</span>} {auxDeduccionAPagar ? <span className={classes.totalRecargoDeduccion}>(Deducción: {auxDeduccionAPagar})</span> : <span className={classes.totalRecargoDeduccion}>(Deducción: {this.state.deduccionAPagar})</span>}</div>
        </Grid>
        <Grid item sm={8} className={classNames(classes.buttonActionsContent, "buttonActionsContent")}>
          <MiCedulon
            tieneBeneficio={this.state.tieneBeneficio}
            registrosSeleccionados={registrosSeleccionados}
            subItemSeleccionado={this.props.info.identificador}
            tipoCedulon={this.props.tipoCedulon}
            tipoTributo={tipoTributo}
            identificador={this.props.identificadorActual}
            disabled={disabledCedulon}
            esJuicio={esJuicio}
            onClick={this.chekearBeneficios}
          />

          <MiMercadoPago
            tieneBeneficio={this.state.tieneBeneficio}
            pagoRedirect={this.props.pagoRedirect}
            idBtnMercadoPago={this.props.menuItemSeleccionado + "2"}
            seccionDetalleTributo={this.props.menuItemSeleccionado}
            registrosSeleccionados={registrosSeleccionados}
            subItemSeleccionado={this.props.info.identificador}
            tipoCedulon={this.props.tipoCedulon}
            tipoTributo={tipoTributo}
            identificador={this.props.identificadorActual}
            disabled={disabledCedulon}
            esJuicio={esJuicio}
            onClick={this.chekearBeneficios}
          />
        </Grid>
      </Grid>

      <MiControledDialog
        paraMobile={this.props.paraMobile}
        open={revisionBeneficios.modal.open}
        onDialogoOpen={this.onRevisionBeneficiosDialogoOpen}
        onDialogoClose={this.onRevisionBeneficiosDialogoClose}
        textoLink={''}
        titulo={'Revisión de períodos seleccionados'}
      >
        {revisionBeneficios.arrayTextoBeneficios && revisionBeneficios.arrayTextoBeneficios.map((textoBeneficio) => {
          return textoBeneficio;
        })}
      </MiControledDialog>

    </div>
  }
}

const styles = theme => ({
  containerDeudaAdm: {
    border: '1px solid',
    borderColor: theme.color.ok.main,
    padding: '10px 0px',
    textAlign: 'center',
    position: 'relative',
    margin: '28px 0px 10px 0px',
    borderRadius: '5px',
    '& h3': {
      marginBottom: '0px'
    }
  },
  tituloDeudaAdm: {
    background: '#fff',
    position: 'absolute',
    fontSize: '14px',
    color: theme.color.ok.main,
    top: '-14px',
    left: '8px',
    padding: '5px'
  },
  buttonActionsContent: {
    textAlign: 'right',
    marginTop: '18px'
  },
  buttonActions: {
    display: 'inline-block',
    minWidth: 'auto',
    margin: '2px',
    borderRadius: '20px',
  },
  contentRecargoDeduccion: {
    position: 'absolute',
    marginLeft: '8px',
  },
  contentRecargoDeduccionTop: {
    bottom: '0px',
  },
  contentRecargoDeduccionBottom: {
    bottom: '0px',
  },
  totalRecargoDeduccion: {
    color: '#aaa',
    padding: '0',
    fontSize: '12px',
    fontFamily: '\"Roboto\", \"Helvetica\", \"Arial\", sans-serif',
    lineHeight: '1',
    fontWeight: 'bold',
  },
  inputTotalPeriodos: {
    position: 'relative'
  },
  textoTotalAPagar: {
    fontSize: '18px'
  },
  totalAPagar: {
    fontWeight: 'bold',
  }
});

let componente = MisPagosDetalle;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
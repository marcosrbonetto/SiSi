import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import classNames from 'classnames';

//Material UI
import Button from "@material-ui/core/Button";
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

//Mis Componentes
import MiControledDialog from "@Componentes/MiControledDialog";
import MiTabla from "@Componentes/MiTabla";

import _ from "lodash";
import { stringToDate, diffDays } from "@Utils/functions"
import { mostrarCargando } from '@Redux/Actions/mainContent';

const mapStateToProps = state => {
  return {
    loggedUser: state.Usuario.loggedUser,
    paraMobile: state.MainContent.paraMobile,
  };
};

const mapDispatchToProps = dispatch => ({
  mostrarCargando: (cargar) => {
    dispatch(mostrarCargando(cargar));
  },
});

class MiAlternativaPlan extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dialogoOpen: false,
      mensajeError: undefined,
      rowList: [],
      disabledCalcular: false,
      showCalcular: false,
      valueCalculo: 'entrega',
      imprimirPlan: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rowList) {
      const copyRowList = _.cloneDeep(nextProps.rowList);

      const rowList = _.filter(copyRowList, (row) => {
        const result = row.vencimiento && diffDays(stringToDate(row.vencimiento), new Date()) >= 60;
        if (result)
          row.data.checked = true;
        return result;
      });

      this.setState({
        rowList: rowList
      })
    }
  }

  onDialogoOpen = () => {
    this.setState({ dialogoOpen: true });
  }

  onDialogoClose = () => {
    this.setState({ dialogoOpen: false });
  }

  getFilasSeleccionadas = (rows, rowsSetSelected) => {
    if (rowsSetSelected.length > 0)
      this.setState({ disabledCalcular: false });
    else
      this.setState({ disabledCalcular: true });
  }

  handleShowCalculador = () => {
    this.setState({ showCalcular: true });
  }

  handleHideCalculador = () => {
    this.setState({ showCalcular: false });
  }

  handleChangeCalculador = event => {
    this.setState({ valueCalculo: event.target.value });
  };

  handleShowImpresion = () => {
    this.setState({ imprimirPlan: true });
  }

  handleHideImpresion = () => {
    this.setState({ imprimirPlan: false });
  }

  render() {
    let { classes } = this.props;
    const { rowList,
      disabledCalcular,
      showCalcular,
      valueCalculo,
      imprimirPlan } = this.state;

    //Datos para generar la grilla
    const rowsPerPage = (rowList.length <= 5 && 5) || (rowList.length > 5 && rowList.length <= 10 && 10) || (rowList.length > 10 && 25);
    const columnas = this.props.data && this.props.data.columnas || null;
    const order = this.props.data && this.props.data.order || 'asc';
    const orderBy = this.props.data && this.props.data.orderBy || 'concepto';

    return (
      <div className={classes.root}>
        <MiControledDialog
          paraMobile={this.props.paraMobile}
          open={this.state.dialogoOpen}
          onDialogoOpen={this.onDialogoOpen}
          onDialogoClose={this.onDialogoClose}
          textoLink={'Simular Plan de Pagos'}
          titulo={'Simular Plan de Pagos'}
          classMaxWidth={classes.maxWidth}
          textoInformativo={<div>
            A continuación se muestran las diferentes opciones de financiamiento:<br />
            <b>Luego de escoger una de las alternativas de plan de pago, deberá acercarse el titular al palacio municipal o CPC, a los efectos de confeccionar el mismo, con la siguiente documentación:</b><br />
            <ul>
              <li><b>D.N.I. (Original y fotocopia)</b></li>
              <li><b>Constancia de C.B.U. emitida por el banco (No cajero automático). En caso de adherir el plan a una cuenta bancaria a nombre de otra persona, también deberá presentarse el titular de dicha cuenta bancaria con D.N.I. (Original y fotocopia)</b></li>
              <li><b>Contrato societario (Para personas jurídicas)</b></li>
            </ul>
          </div>}
        >
          <div key="mainContent">
            {!showCalcular &&
              <MiTabla
                pagination={false}
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
                registrosSeleccionados={[]}
                rowsPerPage={rowsPerPage}
                check={true}
              />

              ||

              <React.Fragment>
                <Grid container spacing={16}>
                  <Grid item xs={6} sm={6} >
                    <Paper className={classes.seccionCalculador} elevation={1}>
                      <RadioGroup
                        aria-label="Entrega"
                        value={valueCalculo}
                        onChange={this.handleChangeCalculador}
                      >
                        <FormControlLabel value="entrega" control={<Radio />} label="% Entrega" />
                        <FormControlLabel value="monto" control={<Radio />} label="Monto" />
                      </RadioGroup>

                      <TextField
                        id="input-calculador"
                        margin="normal"
                        autoComplete="on"
                        placeholder="Ingrese monto"
                      />

                      <Button
                        variant="outlined"
                        color="secondary"
                      //className={classes.buttonActions}
                      >Recalcular</Button>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} sm={6} >
                    <Paper className={classNames(classes.seccionCalculador, classes.seccionCalculadorTotalFinanciar)} elevation={1}>
                      <span>A Financiar:</span>

                      <TextField
                        id="input-calculador"
                        margin="normal"
                        autoComplete="on"
                        placeholder="0,00"
                      />

                    </Paper>
                  </Grid>
                </Grid>

                <ExpansionPanel className={classes.contenedorFinanciamiento}>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Opciones de Financiamiento</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Grid container spacing={16} justifiy="center">
                      <Grid item sm={12} >
                        Contenido
                      </Grid>
                    
                      <Grid item sm={12} className={classes.bottonImprimir}>
                        <MiControledDialog
                          paraMobile={this.props.paraMobile}
                          open={imprimirPlan || false}
                          onDialogoOpen={this.handleShowImpresion}
                          onDialogoClose={this.handleHideImpresion}
                          titulo={'Imprimir'}
                          buttonAction={true}
                        >
                          <div key="buttonAction">
                            <Button
                              variant="outlined"
                              color="secondary"
                              onClick={this.handleShowImpresion}
                            >Imprimir</Button>
                          </div>

                          <div key="mainContent">
                            lala
                            </div>

                        </MiControledDialog>
                      </Grid>
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>

                <ExpansionPanel className={classes.contenedorFinanciamiento}>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Opciones de Financiamiento - Porcentaje de entrega de 50%</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Grid container spacing={16} justifiy="center">
                      <Grid item sm={12} >
                        Contenido
                      </Grid>
                    
                      <Grid item sm={12} className={classes.bottonImprimir}>
                        <MiControledDialog
                          paraMobile={this.props.paraMobile}
                          open={imprimirPlan || false}
                          onDialogoOpen={this.handleShowImpresion}
                          onDialogoClose={this.handleHideImpresion}
                          titulo={'Imprimir'}
                          buttonAction={true}
                        >
                          <div key="buttonAction">
                            <Button
                              variant="outlined"
                              color="secondary"
                              onClick={this.handleShowImpresion}
                            >Imprimir</Button>
                          </div>

                          <div key="mainContent">
                            lala
                            </div>

                        </MiControledDialog>
                      </Grid>
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>

                <br />
              </React.Fragment>
            }
          </div>

          <div key="footerContent" className={classes.footerContent}>
            {!showCalcular && <Button
              variant="contained"
              color="secondary"
              className={classes.buttonActions}
              disabled={disabledCalcular}
              onClick={this.handleShowCalculador}
            >Calcular</Button>
              ||
              <Button
                variant="contained"
                color="secondary"
                className={classes.buttonActions}
                onClick={this.handleHideCalculador}
              >Ver Períodos</Button>
            }
          </div>
        </MiControledDialog>
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    display: 'inline-block'
  },
  maxWidth: {
    minWidth: '100%',
    maxWidth: '100%',
    margin: '0px'
  },
  buttonActions: {
    overflow: 'visible',
    display: 'inline-block',
    minWidth: 'auto',
    margin: '2px',
    borderRadius: '20px',
  },
  footerContent: {
    position: 'absolute',
    bottom: '6px',
    left: '50%',
    marginLeft: '-52px',
  },
  seccionCalculador: {
    display: 'inline-block',
    padding: '0px 14px',
    border: '1px solid #149257',
    '& > *': {
      display: 'inline-flex',
      marginRight: '10px',
    },
    '& > *:last-child': {
      marginRight: '0px',
    }
  },
  seccionCalculadorTotalFinanciar: {
    paddingBottom: '8px',
    float: 'right'
  },
  contenedorFinanciamiento: {
    border: '1px solid #149257',
    marginTop: '10px'
  },
  bottonImprimir: {
    display: 'flex',
    justifyContent: 'center',
  }
});

let componente = MiAlternativaPlan;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
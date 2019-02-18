import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import classNames from 'classnames';
import _ from "lodash";

//Alert
import { mostrarAlerta, mostrarMensaje } from "@Utils/functions";
import { getAllUrlParams } from "@Utils/functions"

import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from '@material-ui/core/Grid';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import TextField from "@material-ui/core/TextField";

import MiControledDialog from "@Componentes/MiControledDialog";
import MiPDFPrinter from "@Componentes/MiPDFPrinter";

import services from '@Rules/Rules_TributarioOnline';
import { mostrarCargando } from '@Redux/Actions/mainContent';
import { setPagosMercadoPago } from "@ReduxSrc/TributarioOnline/DetalleTributario/actions";
import { stringToFloat, formatNumber } from "@Utils/functions"
import servicesTributarioOnline from '@Rules/Rules_TributarioOnline';
import { debug } from "util";

const mapStateToProps = state => {
  return {
    loggedUser: state.Usuario.loggedUser,
    infoPagosMercadoPago: state.DetalleTributario.infoPagosMercadoPago,
    publicKeyMercadoPago: state.MainContent.publicKeyMercadoPago,
    paraMobile: state.MainContent.paraMobile,
    tipoTributos: state.MainContent.tipoTributos,
    tipoCedulones: state.MainContent.tipoCedulones,
  };
};

const mapDispatchToProps = dispatch => ({
  mostrarCargando: (cargar) => {
    dispatch(mostrarCargando(cargar));
  },
  setPropsUpdatePagosMercadoPago: (arrayNexos) => {
    dispatch(setPagosMercadoPago(arrayNexos));
  }
});

class MiMercadoPago extends React.PureComponent {
  constructor(props) {
    super(props);

    const email = (this.props.loggedUser.datos && this.props.loggedUser.datos.email) || this.props.infoPagosMercadoPago.email || '';

    this.state = {
      dialogoOpen: false,
      disabled: this.props.disabled,
      arrayNexos: [],
      email: email,
      base64Cedulon: '',
      validacionEmail: {
        errorEmail: false,
        emailValidado: false
      }
    };
  }

  componentWillReceiveProps(nextProps) {

    if (JSON.stringify(this.props.disabled) != JSON.stringify(nextProps.disabled)) {
      this.setState({
        ...this.state,
        disabled: nextProps.disabled
      });
    }
  }

  componentDidMount() {
    this.props.mostrarCargando(true);

    //Reseteamos Valores de DetalleTributario (Redux)
    const idBtnMercadoPago = localStorage.getItem('idBtnMercadoPago');
    if (idBtnMercadoPago && this.props.idBtnMercadoPago == idBtnMercadoPago) {

      if (this.props.infoPagosMercadoPago.arrayNexos && this.props.infoPagosMercadoPago.arrayNexos.length > 0) {
        this.setState({
          ...this.state,
          dialogoOpen: true,
          arrayNexos: this.props.infoPagosMercadoPago.arrayNexos
        });
      } else {
        this.setState({
          ...this.state,
          dialogoOpen: false,
          arrayNexos: []
        });
        mostrarMensaje('Pago MercadoPago: Pago realizado exitosamente');
      }

    }

    localStorage.removeItem('idBtnMercadoPago');
    this.props.mostrarCargando(false);
  }

  onBotonCedulonClick = () => {
    this.props.mostrarCargando(true);

    if (this.props.onClick) {
      this.props.mostrarCargando(false);
      this.props.onClick(() => {
        this.props.mostrarCargando(true);
        //Carga de todos los nexos y mostramos para pagar el primero de ellos
        this.cargarNexos();
      });
    } else {
      //Carga de todos los nexos y mostramos para pagar el primero de ellos
      this.cargarNexos();
    }
  }

  cargarNexos = () => {
    const registros = this.props.registrosSeleccionados;
    const token = this.props.loggedUser.token;
    const opcion = "0"; // Hoy

    const tieneBeneficio = this.props.tieneBeneficio || false;

    if (registros.length > 0 || this.props.esJuicio || this.props.allSelected) {
      services.getReporteCedulon(token,
        {
          "tipoTributo": parseInt(this.props.tipoTributo),
          "identificador": this.props.identificador,
          "opcionVencimiento": parseInt(opcion),
          "periodos": registros,
          "tipoCedulon": this.props.tipoCedulon,
          "subItem": this.props.subItemSeleccionado || this.props.subItem,
          "esPagoElectronico": true,
          "esCuotaGlobal": tieneBeneficio
        })
        .then((datos) => {

          if (!datos.ok) { mostrarAlerta(datos.error); this.props.mostrarCargando(false); return false; }

          const resultData = datos.return;
          let arrayNexos = [];
          _.each(resultData.nexos, (nexo) => {
            var itemNexo = { ...nexo };
            itemNexo.totalPeriodo = 0;

            _.each(nexo.periodos, (periodo) => {
              itemNexo.totalPeriodo += stringToFloat(periodo.importe.total, 2);
            });

            itemNexo.totalPeriodo = formatNumber(itemNexo.totalPeriodo);
            arrayNexos.push(itemNexo);
          });

          this.setState({
            ...this.state,
            dialogoOpen: true,
            arrayNexos: arrayNexos,
            base64Cedulon: resultData && resultData.reporte ? 'data:application/pdf;base64,' + resultData.reporte : ''
          });

          //Generamos la descripción
          const tipoTributo = this.props.tipoTributos.byKey[parseInt(this.props.tipoTributo)];
          const identificador = this.props.identificador;
          const idTipoCedulon = this.props.tipoCedulones.byValue[this.props.tipoCedulon];

          let descripcionRecibo = 'Periodo/s ' + _.map(registros, function (obj) { return obj; }).join(', ') + ' del ' + tipoTributo + ' ' + identificador;
          let causa = undefined;
          if (idTipoCedulon == 2) { //Solo en tipoCedulon Multa 
            descripcionRecibo = 'Multa/s ' + _.map(registros, function (obj) { return obj; }).join(', ') + ' de ' + identificador;
            causa = registros[0];
          }

          this.props.setPropsUpdatePagosMercadoPago({
            arrayNexos: arrayNexos,
            descripcionRecibo: descripcionRecibo,
            causa: causa //Solo en Multas
          });
          this.props.mostrarCargando(false);
        })
        .catch((err) => { 
          console.log(err);
          this.props.mostrarCargando(false);
        });
    } else {
      this.setState({
        ...this.state,
        dialogoOpen: false,
        arrayNexos: [],
        base64Cedulon: ''
      });
      this.props.mostrarCargando(false);
    }
  }

  onDialogoClose = () => {

    this.setState({
      ...this.state,
      dialogoOpen: false,
      arrayNexos: [],
      base64Cedulon: ''
    });
  }

  loadModalMercadoLibre = (element) => {
    //Carga de componente de MercadoPago por nexo para realizar el pago
    if (element == null) return false;

    const script = document.createElement("script");
    const totalPeriodo = element.attributes.totalPeriodo.value;

    script.src = "https://www.mercadopago.com.ar/integrations/v1/web-tokenize-checkout.js";
    script.setAttribute("data-public-key", this.props.publicKeyMercadoPago);
    script.setAttribute("data-transaction-amount", stringToFloat(totalPeriodo, 2));
    script.setAttribute("data-button-label", "Pagar Online");

    element && element.appendChild(script);
  }

  handleSubmit = (event) => {
    event.preventDefault();
  }

  getNextStep = (arrayNexos) => {
    if (!arrayNexos || !Array.isArray(arrayNexos)) return 0;

    for (let index = 0; index < arrayNexos.length; index++) {
      const nexo = arrayNexos[index];

      if (!nexo.pagado) {
        return index;
      }
    }

    return 0;
  }

  handleInputEmail = (event) => {
    this.setState({
      email: event.target.value
    });
  }

  handleValidarEmail = () => {
    const emailIngresado = this.state.email;

    if (!/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(emailIngresado)) {
      this.setState({
        ...this.state,
        validacionEmail: {
          ...this.state.validacionEmail,
          errorEmail: true
        }
      });
      return;
    }

    this.setState({
      ...this.state,
      validacionEmail: {
        errorEmail: false,
        emailValidado: true
      }
    });
  }

  render() {
    let { classes } = this.props;
    const { base64Cedulon } = this.state;
    const activeStep = 0;

    return (
      <div className={classes.root}>
        <MiControledDialog
          paraMobile={this.props.paraMobile}
          open={this.state.dialogoOpen}
          onDialogoClose={this.onDialogoClose}
          buttonAction={true}
          textoLink={'Plataforma Online de MercadoPago'}
          titulo={'Plataforma Online de MercadoPago'}
          classMaxWidth={classes.maxWidth}
        >
          <div key="buttonAction">
            <Button
              variant="contained"
              color="secondary"
              className={classNames(classes.buttonActions, classes.buttonMercadoLibre)}
              onClick={() => { this.onBotonCedulonClick() }}
              disabled={this.state.disabled}
              modal={'MercadoPago'}
            >
              <Typography className={classes.buttonActionsCaption} variant="caption" gutterBottom align="center">
                Pago Online
                    </Typography>
            </Button>
          </div>

          <div key="headerContent">
            <Typography variant="subheading" gutterBottom>
              <b>Atención: </b> Usted está a punto de pagar online ingresando los datos de la tarjeta de débito o crédito.
              Los mismos serán tomados por la plataforma de MercadoPago por lo que la Municipalidad de Córdoba no tendrá responsabilidad sobre ellos.
                    </Typography>
          </div>

          <div key="mainContent">

            {!this.state.validacionEmail.emailValidado && <div>
              <Typography variant="subheading" gutterBottom>
                A continuación ingrese un correo en el que estará asociado su pago con la plataforma MercadoPago
              </Typography>
              <Grid container spacing={0} alignItems="flex-end">
                <Grid item xs={12} sm={9}>
                  <TextField
                    id="email-input"
                    label="Email"
                    className={classes.selectTipoTributo}
                    type="email"
                    name="email"
                    autoComplete="email"
                    margin="normal"
                    value={this.state.email}
                    onChange={this.handleInputEmail}
                    autoFocus={true}
                    error={this.state.validacionEmail.errorEmail}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.buttonActions}
                    onClick={this.handleValidarEmail}
                  >
                    Continuar
                </Button>
                </Grid>
              </Grid>
              <br />
            </div>}

            {this.state.validacionEmail.emailValidado && this.state.arrayNexos && this.state.arrayNexos.length > 0 &&
              <Stepper
                activeStep={this.getNextStep(this.state.arrayNexos)}
                orientation="vertical">
                {Array.isArray(this.state.arrayNexos) && this.state.arrayNexos.length > 0 && this.state.arrayNexos.map((nexo, index) => {

                  return (
                    <Step key={index}>
                      <StepLabel
                        StepIconProps={{
                          classes: { root: classes.stepIcon }
                        }}>Cedulón: {nexo.nexo}</StepLabel>
                      <StepContent>
                        <Grid container spacing={0}>
                          <Grid item md={12}>
                            <Typography variant="title" gutterBottom className={classes.titleNexo}>
                              Total a pagar: $ {nexo.totalPeriodo}
                            </Typography>

                            {/* Si el nexo esta pagado se muestra que lo está - Si no esta pagado, 
                            se muestra solo el botón (form) en el primero que se encuentre sin pagar, 
                            en los siguientes se muestra un pensaje como pendiente a pagar */}
                            {(nexo.pagado && <div className={classes.pagoExito}>(Nexo pagado con éxito)</div>) ||
                              (this.state.arrayNexos && _.find(this.state.arrayNexos, function (x) { return !x.pagado }).nexo != nexo.nexo ? <div className={classes.pagoExito}>(Nexo pendiente a pagar)</div> :
                                <form
                                  id={"formMercadoLibre-" + nexo.nexo}
                                  onSubmit={this.handleSubmit}
                                  ref={this.loadModalMercadoLibre}
                                  totalPeriodo={nexo.totalPeriodo}
                                  className={classes.formMercadoLibre}
                                  action="#/PagoNexo"
                                >
                                  <input type="hidden" value="true" name="mercadoPago" />
                                  <input type="hidden" value={nexo.nexo} name="nexo" />
                                  <input type="hidden" value={nexo.tipoTributo} name="tipoTributo" />
                                  <input type="hidden" value={nexo.identificador} name="identificador" />
                                  <input type="hidden" value={this.props.seccionDetalleTributo} name="seccionDetalleTributo" />
                                  <input type="hidden" value={this.props.idBtnMercadoPago} name="idBtnMercadoPago" />
                                  <input type="hidden" value={this.props.pagoRedirect ? this.props.pagoRedirect : '/'} name="urlRedirect" />
                                  <input type="hidden" value={this.state.email} name="email" />
                                  <input type="hidden" value={this.props.tipoCedulon} name="tipoCedulon" />
                                </form>)}

                          </Grid>
                        </Grid>
                      </StepContent>
                    </Step>
                  );
                })}
              </Stepper>}
            {this.state.arrayNexos && !this.state.arrayNexos.length > 0 && <div style={{ color: 'red' }}>Se están presentando inconvenientes para pagar con MercadoPago, intente más tarde.</div>}
          </div>

          <div key="footerContent">
            {base64Cedulon != '' && <Typography variant="subheading" gutterBottom>
              Si lo desea puede descargar el cedulón que comprende los períodos que pagará a continuación mediante Mercado Pago: 
              <MiPDFPrinter
                  base64File={base64Cedulon}
                  textoLink={'Descargar Cedulón'}
                  textoFile={'Cedulon Mercado Pago'}
                  descargaDirecta={true}
                  buttonStyle={classes.buttonDescarga}
                />
              </Typography>}
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
  buttonActions: {
    overflow: 'visible',
    display: 'inline-block',
    minWidth: 'auto',
    margin: '2px',
    borderRadius: '20px',
  },
  buttonMercadoLibre: {
    backgroundColor: '#fff !important',
    backgroundImage: 'url(https://botw-pd.s3.amazonaws.com/styles/logo-thumbnail/s3/082013/untitled-1_49.png?itok=S3wtZ8fs)',
    backgroundSize: '115px',
    backgroundPosition: '5px',
    backgroundRepeat: 'no-repeat',
    width: '128px',
    '&:hover': {
      background: '#fff',
      backgroundImage: 'url(https://botw-pd.s3.amazonaws.com/styles/logo-thumbnail/s3/082013/untitled-1_49.png?itok=S3wtZ8fs)',
      backgroundSize: '115px',
      backgroundPosition: '5px',
      backgroundRepeat: 'no-repeat',
    }
  },
  buttonActionsCaption: {
    top: '40px',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90px'
  },
  formMercadoLibre: {
    display: 'inline-block',
    margin: '0px 25px',
    verticalAlign: '4px',
  },
  pagoExito: {
    display: 'inline-block',
    margin: '0px 25px',
  },
  titleNexo: {
    display: 'inline-block',
    fontWeight: '100'
  },
  stepIcon: {
    color: '#149257 !important',
    '& text': {
      fill: '#fff'
    }
  },
  maxWidth: {
    maxWidth: '564px'
  },
  selectTipoTributo: {
    width: '100%'
  },
  buttonDescarga: {
    borderColor: '#46b8da',
    color: '#46b8da',
    minHeight: '0px',
    height: '24px',
  },
});

let componente = MiMercadoPago;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
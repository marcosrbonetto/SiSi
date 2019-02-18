import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import classNames from "classnames";

import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";

import MiControledDialog from "@Componentes/MiControledDialog";
import MiPDFPrinter from "@Componentes/MiPDFPrinter";

import servicesTributarioOnline from '@Rules/Rules_TributarioOnline';
import servicesInterBanking from '@Rules/Rules_InterBanking';
import { mostrarCargando } from '@Redux/Actions/mainContent';

import { infoPDF } from './infoPDF.js';

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

class MiInterBanking extends React.PureComponent {
  constructor(props) {
    super(props);

    const visible = props.tipoCedulon == "Contribucion" && [3, 7].indexOf(props.tipoTributo) != -1; //Comercios

    this.state = {
      mensajeError: undefined,
      base64Cedulon: '',
      infoCupon: undefined,
      disabled: this.props.disabled,
      visible: visible
    };
  }

  componentWillReceiveProps(nextProps) {

    if (JSON.stringify(this.props.disabled) != JSON.stringify(nextProps.disabled)) {
      this.setState({
        disabled: nextProps.disabled
      });
    }
  }

  handleClick = () => {
    //Vemos si tiene un acción antes de mostrar el listado
    if (this.props.onClick) {
      this.props.onClick(() => {
        this.onBotonCedulonClick()
      });
    } else {
      this.onBotonCedulonClick()
    }

  };

  onBotonCedulonClick = (event) => {

    this.props.mostrarCargando(true);
    const registros = this.props.registrosSeleccionados;
    const token = this.props.loggedUser.token;
    const opcion = "0"; // Hoy

    const tieneBeneficio = this.props.tieneBeneficio || false;

    if (registros.length > 0 || this.props.esJuicio || this.props.allSelected) {
      const servicio1 = servicesTributarioOnline.getReporteCedulon(token,
        {
          "tipoTributo": parseInt(this.props.tipoTributo),
          "identificador": this.props.identificador,
          "opcionVencimiento": parseInt(opcion),
          "periodos": registros,
          "tipoCedulon": this.props.tipoCedulon,
          "subItem": this.props.subItemSeleccionado || this.props.subItem,
          "esPagoElectronico": false,
          "esCuotaGlobal": tieneBeneficio
        })
        .then((datos) => {
          if (!datos.ok) {
            this.setState({
              base64Cedulon: ''
            });
            return false;
          } //mostrarAlerta(datos.error); 

          const resultData = datos.return;

          this.setState({
            base64Cedulon: resultData && resultData.reporte ? 'data:application/pdf;base64,' + resultData.reporte : '',
          });
        })
        .catch((err) => { console.log(err); });

      const servicio2 = servicesInterBanking.generacionCTLInterBanking(token,
        {
          "tipoTributo": parseInt(this.props.tipoTributo),
          "identificador": this.props.identificador,
          "opcionVencimiento": parseInt(opcion),
          "periodos": registros,
          "tipoCedulon": this.props.tipoCedulon,
          "subItem": this.props.subItemSeleccionado || this.props.subItem,
          "esPagoElectronico": false,
          "esCuotaGlobal": tieneBeneficio
        })
        .then((datos) => {
          if (!datos.ok) {
            this.setState({
              dialogoOpen: true,
              infoCupon: undefined,
              mensajeError: datos.error
            });
            this.props.mostrarCargando(false);
            return false;
          }

          const resultData = datos.return;

          this.setState({
            //No vamos a mostrar el cedulon, pero lo dejamos por si las dudas
            dialogoOpen: true,
            infoCupon: resultData,
            mensajeError: undefined
          });
        })
        .catch((err) => { console.log(err); });

      Promise.all([servicio1, servicio2]).then(() => {
        this.props.mostrarCargando(false);
      }).catch(err => {
        console.warn("[Advertencia] Ocurrió un error al intentar comunicarse con el servidor.");
      });
    } else {
      this.setState({
        dialogoOpen: true,
        infoCupon: undefined,
      });
      this.props.mostrarCargando(false);
    }
  }

  onDialogoOpen = () => {
    this.setState({ dialogoOpen: true });
  }

  onDialogoClose = () => {
    this.setState({ dialogoOpen: false });
  }

  render() {
    let { classes } = this.props;
    const { visible, mensajeError, infoCupon, base64Cedulon } = this.state;

    return (<div className={classNames(classes.root, "BtnMisBeneficios")}>
      {visible &&
        <div className={classes.root}>
          <MiControledDialog
            paraMobile={this.props.paraMobile}
            open={this.state.dialogoOpen}
            onDialogoOpen={this.onDialogoOpen}
            onDialogoClose={this.onDialogoClose}
            buttonAction={true}
            textoLink={'Plataforma Online de InterBanking'}
            titulo={'Plataforma Online de InterBanking'}
          >
            <div key="buttonAction">
              <Button
                variant="contained"
                color="secondary"
                className={classNames(classes.buttonActions, classes.buttonMercadoLibre)}
                onClick={this.handleClick}
                disabled={this.state.disabled}
              >
                <Typography className={classes.buttonActionsCaption} variant="caption" gutterBottom align="center">
                  Pago Online
                    </Typography>
              </Button>
            </div>

            <div key="mainContent">
              <div>
                Sr. Contribuyente:<br />
                Le recordamos que para poder realizar el pago mediante Interbanking, Ud. deberá previamente vincular su cuenta a la comunidad correspondiente de pago (En éste caso la Municipalidad de Córdoba).<br />
                Manual de ayuda para vincular su cuenta:
              <MiPDFPrinter
                  base64File={'data:application/pdf;base64,' + encodeURIComponent(infoPDF)}
                  textoLink={'Descargar'}
                  textoFile={'Manual de Ayuda - InterBaking'}
                  descargaDirecta={true}
                  buttonStyle={classes.buttonAyuda}
                /><br /><br />
              </div>

              {infoCupon &&
                <div>
                  <span className={classes.textoInfoCupon}>Se generó correctamente {infoCupon.lenght > 1 ? 'los cupones' : 'el cupón'} de pago. </span>
                  <Button
                    variant="contained"
                    color="secondary"
                    href={'https://sib1.interbanking.com.ar/secureLogin.do?from=home'}
                    target="_blank"
                  >
                    Pagar
              </Button>
                  {infoCupon.map((cuponCTL) => {
                    return <div className={classes.textoCTL}>{cuponCTL.descripcion}</div>;
                  })}
                </div>}
              {mensajeError &&
                <div style={{ color: 'red' }}>{mensajeError}</div>
              }
              {/* MUESTRA DE CEDULON */}
              {/*this.state.base64Cedulon != '' &&
              <object data={this.state.base64Cedulon} type="application/pdf" height="384px" width="856px">
                <a href={this.state.base64Cedulon} download>Descargar Cedulon</a>
              </object>*/}
              {/*this.state.base64Cedulon == '' && <div style={{ color: 'red' }}>{this.state.mensajeError || "Se están presentando inconvenientes para generar el cedulón, intente más tarde."}</div>*/}
              <br />
            </div>

            <div key="footerContent">
              {base64Cedulon != '' && <Typography variant="subheading" gutterBottom>
                Si lo desea puede descargar el cedulón que comprende los períodos que pagará a continuación mediante InterBaking:
                <MiPDFPrinter
                  base64File={base64Cedulon}
                  textoLink={'Descargar Cedulón'}
                  textoFile={'Cedulon InterBanking'}
                  descargaDirecta={true}
                  buttonStyle={classes.buttonDescarga}
                />
              </Typography>}
            </div>
          </MiControledDialog>
        </div>
      }</div>);
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
  buttonActionsCaption: {
    top: '40px',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90px'
  },
  buttonAyuda: {
    borderColor: '#46b8da',
    color: '#46b8da',
    minHeight: '0px',
    height: '24px',
    marginLeft: '8px',
  },
  buttonMercadoLibre: {
    backgroundColor: '#fff !important',
    backgroundImage: 'url(https://www.interbanking.com.ar/images/logoIB.png)',
    backgroundSize: '115px',
    backgroundPosition: '5px',
    backgroundRepeat: 'no-repeat',
    width: '128px',
    '&:hover': {
      background: '#fff',
      backgroundImage: 'url(https://www.interbanking.com.ar/images/logoIB.png)',
      backgroundSize: '115px',
      backgroundPosition: '5px',
      backgroundRepeat: 'no-repeat',
    }
  },
  textoInfoCupon: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: '18px',
  },
  textoCTL: {
    color: '#149257'
  },
  buttonDescarga: {
    borderColor: '#46b8da',
    color: '#46b8da',
    minHeight: '0px',
    height: '24px',
  }
});

let componente = MiInterBanking;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
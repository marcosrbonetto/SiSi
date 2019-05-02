import React from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import _ from "lodash";

//Router
import { withRouter } from "react-router-dom";

//REDUX
import { connect } from "react-redux";
import { push } from "connected-react-router";

//Assets
import Logo_SiSi from "@Assets/images/Logo_SiSi.png";

//Rules
import Rules_Preinscripcion from "@Rules/Rules_Preinscripcion";

//Services
import { mostrarAlerta } from "@Utils/functions";
import { mostrarCargando } from '@Redux/Actions/mainContent';

//Mis Componentes
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import MiCard from "@Componentes/MiCard";
import MiControledDialog from "@Componentes/MiControledDialog";
import Icon from '@material-ui/core/Icon';

const mapStateToProps = state => {
  return {
    loggedUser: state.Usuario.loggedUser,
    usuario: state.Usuario.usuario,
    cargando: state.MainContent.cargando,
    paraMobile: state.MainContent.paraMobile,
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

class ValidarCertificado extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputCodigo: '',
      mostrarDialog: false,
      mensaje: '',
      validadionOK: false
    };
  }

  componentDidMount() {

  }

  handleOnChangeInputCodigo = (event) => {
    this.setState({
      inputCodigo: event.target.value
    })
  }

  handleOnClickValidar = () => {
    if (this.state.inputCodigo && this.state.inputCodigo.length == 6) {
      const codigo = this.state.inputCodigo;

      this.setState({
        inputCodigo: ''
      }, () => {

        Rules_Preinscripcion.validarCodigo(codigo)
          .then((datos) => {
            this.props.mostrarCargando(false);
            if (!datos.ok) {
              this.setState({
                mostrarDialog: true,
                mensaje: datos.error,
                validadionOK: false
              });
              return false;
            }

            const datosCertificado = datos.return;
            //mostrar datos de preinscripcion
            this.setState({
              mostrarDialog: true,
              mensaje: `Se corrobora que el alumno ${datosCertificado.apellido}, ${datosCertificado.nombre} (CUIT: ${datosCertificado.cuit}), recibió el certificado para el curso ${datosCertificado.curso.nombre} lugar ${datosCertificado.curso.lugar} en el programa ${datosCertificado.curso.nombrePrograma}.`,
              validadionOK: true
            });
          })
          .catch((error) => {
            mostrarAlerta('Ocurrió un error al intentar obtener los programas.');
            console.error('Error Servicio "Rules_Preinscripcion.getProgramas": ' + error);
          });

      });

    } else {
      this.setState({
        mostrarDialog: true,
        mensaje: 'Debe ingresar un código que conste de 6 dígitos.',
        validadionOK: false
      });
    }
  }

  handleOnOpenDialog = () => {
    this.setState({
      mostrarDialog: true
    });
  }

  handleOnCloseDialog = () => {
    this.setState({
      mostrarDialog: false,
      mensaje: '',
      validadionOK: false
    });
  }

  render() {
    const { classes } = this.props;
    const { inputCodigo, validadionOK, mostrarDialog, mensaje } = this.state;

    return (
      <React.Fragment>
        <div className={classes.root}>
          <img src={Logo_SiSi} width={150} height={84} /><br />
          <Typography variant="title" className={classes.textoInformativo}>
            Ingrese a continuación el código que se encuentra en su certificado para comprobar que el mismo sea válido.
          </Typography>

          <MiCard className={classes.containerInputCodigo} contentClassName={classes.contentInputCodigo}>
            <TextField
              id="codigo-certificado"
              label="Ingrese su código"
              placeholder="Ej.:EF4HV5"
              className={classes.inputCodigo}
              value={inputCodigo}
              onChange={this.handleOnChangeInputCodigo}
              InputLabelProps={{
                shrink: true,
                className: classes.colorLabelInputCodigo
              }}
              margin="normal"
              variant="outlined"
              inputProps={{
                maxLength: 6,
              }}
            />
            <Button onClick={this.handleOnClickValidar} size="small" variant="outlined" color="primary">
              Validar
            </Button>

          </MiCard>
        </div>

        <MiControledDialog
          open={mostrarDialog}
          onDialogoOpen={this.handleOnOpenDialog}
          onDialogoClose={this.handleOnCloseDialog}
        >
          {!validadionOK &&
            <React.Fragment>
              <Icon className={classes.codigoError}>error_outline</Icon>
              <Typography variant="title" className={classes.textoInformativo}>
                Código Erroneo
              </Typography>
              <br />
              <Typography variant="body2">
                {mensaje || 'El código ingresado no pertenece a ningún certificado válido.'}
              </Typography>
            </React.Fragment>
            ||
            <React.Fragment>
              <Icon className={classes.codigoOK}>check_circle_outline</Icon>
              <Typography variant="title" className={classes.textoInformativo}>
                Código Válido
              </Typography>
              <br />
              <Typography variant="body2">
                {mensaje || 'El código ingresado pertenece a un certificado válido.'}
              </Typography>
            </React.Fragment>
          }
        </MiControledDialog>

      </React.Fragment>
    );
  }
}

const styles = theme => {
  return {
    root: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      flexDirection: 'column'
    },
    codigoError: {
      color: theme.color.error.main,
      fontSize: '100px',
      display: 'block',
      margin: '0px auto',
    },
    codigoOK: {
      color: theme.color.ok.main,
      fontSize: '100px',
      display: 'block',
      margin: '0px auto',
    },
    textoInformativo: {
      maxWidth: '600px',
      textAlign: 'center',
      margin: '0px auto',
      display: 'block'
    },
    inputCodigo: {
      margin: '0px',
      marginRight: '15px'
    },
    containerInputCodigo: {
      marginTop: '10px',
    },
    contentInputCodigo: {
      padding: '20px !important',
      display: 'flex'
    },
    colorLabelInputCodigo: {
      color: theme.color.ok.main
    }
  }
};

let componente = undefined;
componente = withStyles(styles)(ValidarCertificado);
componente = withWidth()(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;

import React from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from 'classnames';

import Typography from "@material-ui/core/Typography";

import ReCAPTCHA from "react-google-recaptcha";

//Redux
import { connect } from "react-redux";
import { mostrarCargando } from '@Redux/Actions/mainContent'
import { replace } from "connected-react-router";
import { setAccessCaptcha, setStateAccess } from "@ReduxSrc/CaptchaAccess/actions";
import { withRouter } from "react-router-dom";

//Rules
import Rules_Captcha from '@Rules/Rules_Captcha';

//Utils
import { mostrarAlerta } from "@Utils/functions";

const mapStateToProps = state => {
  return {
    loggedUser: state.Usuario.loggedUser,
    visible: !state.CaptchaAccess.estadoAccesoWS
  };
};

const mapDispatchToProps = dispatch => ({
  mostrarCargando: (cargar) => {
    dispatch(mostrarCargando(cargar));
  },
  redireccionar: url => {
    dispatch(replace(url));
  },
  setAccessCaptcha: (data) => {
    dispatch(setAccessCaptcha(data));
  },
  setStateAccess: (data) => {
    dispatch(setStateAccess(data));
  }
});

class MiCaptcha extends React.PureComponent {

  constructor(props) {
    super(props);

    this.token = 'INVITADO';

    this.state = {

    };
  }

  componentDidMount() {
    this.props.handleAfterMount && this.props.handleAfterMount();
  }

  onChangeCaprcha = (valueCaptcha) => {

    Rules_Captcha.validarCaptcha(this.token, valueCaptcha)
      .then(datos => {

        if (!datos.ok) { mostrarAlerta(datos.error); return false; }

        this.props.setAccessCaptcha(datos.return);
        this.props.setStateAccess(true); //Seteamos acceso correcto

        this.props.mostrarCargando('reset');
        //Refrescamos la pagina
        window.location.reload();

      })
      .catch(error => {
        mostrarAlerta('Ocurrió un error al verificar el captcha, intente nuevamente.')
      });
  };

  render() {
    let { classes, classNameCaptcha } = this.props;

    return (
      <div
        className={classNames(
          classes.root,
          this.props.visible === true && classes.visible
        )}
      >
        <i className={classNames(classes.iconoSeguridad, "material-icons")}>
          security
      </i>
        <br />
        <Typography variant="title" className={classes.textoExplicativo}>
          Por cuestiones de seguridad, se solicita realizar una validación de usuario presionando en el check de abajo.
      </Typography>
        <br />
        <ReCAPTCHA
          className={classNameCaptcha}
          sitekey="6LeknYMUAAAAAKeaBSCIRJW4R16vZdK6zEc76PC4"
          onChange={this.onChangeCaprcha}
        />
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0,
    pointerEvents: "none",
    transition: "all 0.3s",
    zIndex: 1000000,
    background: 'rgba(255,255,255,0.5)',
    width: '100%',
    flexDirection: 'column'
  },
  visible: {
    opacity: 1,
    pointerEvents: "auto"
  },
  iconoSeguridad: {
    height: 'fit-content',
    alignSelf: 'center',
    maxWidth: '300px',
    textAlign: 'center',
    fontSize: '40px',
    color: '#4a90e2',
  },
  textoExplicativo: {
    height: 'fit-content',
    alignSelf: 'center',
    maxWidth: '300px',
    textAlign: 'center',
  }
});

let componente = MiCaptcha;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
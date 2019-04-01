import React from "react";
import { withRouter } from "react-router-dom";

import _ from "lodash";

//Styles
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import classNames from "classnames";

//Redux
import { mostrarCargando } from '@Redux/Actions/mainContent'
import { mostrarAlerta, mostrarMensaje } from "@Utils/functions";
import { actualizarDatosExtras } from '@Redux/Actions/usuario';
import { push } from "connected-react-router";

//Material UI
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Icon from '@material-ui/core/Icon';

//Mis Componentes
import MiInput from "@Componentes/MiInput";
import { onInputChangeValidateForm, onInputFocusOutValidateForm, validateForm } from "@Componentes/MiInput";

import MiCard from "@Componentes/MiNewCard";

import Rules_Usuario from "@Rules/Rules_Usuario";

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
  actualizarDatosExtras: (datosExtras) => {
    dispatch(actualizarDatosExtras(datosExtras));
  },
  redireccionar: url => {
    dispatch(push(url));
  },
});

class FormDatosExtrasCV extends React.PureComponent {
  constructor(props) {
    super(props);

    const datos = props.loggedUser.datos;

    this.state = {
      formInputs: [
        {
          id: 'InputHabilidades',
          value: datos.habilidades || '',
          valiateCondition: /^[^]{0,150}$/,
          error: false,
          required: false,
          mensajeError: 'Este campo es obligatorio y tiene un límite de 150 catacteres.'
        },
        {
          id: 'InputIdiomas',
          value: datos.idiomas || '',
          valiateCondition: /^[^]{0,150}$/,
          error: false,
          required: false,
          mensajeError: 'Este campo es obligatorio y tiene un límite de 150 catacteres.'
        },
        {
          id: 'InputReferencias',
          value: datos.referencias || '',
          valiateCondition: /^[^]{0,150}$/,
          error: false,
          required: false,
          mensajeError: 'Este campo es obligatorio y tiene un límite de 150 catacteres.'
        }
      ]
    };
  }

  onChangeInput = (value, type, input, props) => {

    const newformInputs = onInputChangeValidateForm(this.state.formInputs, { value, type, input, props });

    this.setState({
      formInputs: newformInputs
    });
  }

  onFocusOutInput = (input, props) => {

    const newformInputs = onInputFocusOutValidateForm(this.state.formInputs, { input, props });

    this.setState({
      formInputs: newformInputs
    });
  }

  validateForm = () => {

    const resultValidation = validateForm(this.state.formInputs);

    let formHayError = resultValidation.formHayError;
    let formInputs = resultValidation.formInputs;

    this.setState({
      formInputs: _.cloneDeep(formInputs)
    });

    return formHayError;
  }

  agregarDatosExtras = () => {
    this.props.mostrarCargando(true);

    const token = this.props.loggedUser.token;

    let formInputs = this.state.formInputs;
    const formHayError = this.validateForm();

    if (formHayError) {
      mostrarAlerta('Se han encontrado campos erroneos.');
      this.props.mostrarCargando(false);
      return false;
    }

    const InputHabilidades = _.find(formInputs, { id: 'InputHabilidades' });
    const InputIdiomas = _.find(formInputs, { id: 'InputIdiomas' });
    const InputReferencias = _.find(formInputs, { id: 'InputReferencias' });

    const datosExtras = {
      "habilidades": InputHabilidades.value,
      "idiomas": InputIdiomas.value,
      "referencias": InputReferencias.value
    };

    Rules_Usuario.insertarDatosExtras(token, datosExtras)
      .then((datos) => {
        this.props.mostrarCargando(false);
        if (!datos.ok) {
          mostrarAlerta('Ocurrió un error al intentar guardar los datos adicionales.');
          return false;
        }

        this.props.actualizarDatosExtras(datosExtras);
        mostrarMensaje('Datos adicionales agregados exitosamente!');
      })
      .catch((error) => {
        this.props.mostrarCargando(false);
        mostrarAlerta('Ocurrió un error al intentar guardar los datos adicionales.');
        console.error('Error Servicio "Rules_Usuario.getInfoUsuario": ' + error);
      });
  }

  volverInicio = () => {
    this.props.redireccionar("/Inicio");
  }

  render() {
    const {
      classes
    } = this.props;

    const {
      formInputs
    } = this.state;

    //Set inputs
    const InputHabilidades = _.find(formInputs, { id: 'InputHabilidades' });
    const InputIdiomas = _.find(formInputs, { id: 'InputIdiomas' });
    const InputReferencias = _.find(formInputs, { id: 'InputReferencias' });

    return (
      <React.Fragment>

        <MiCard
          informacionAlerta={'Cargá acá tu tus datos adicionales que permita que tu Curriculum Vitae permanezca completo.'}
          seccionBotones={{
            align: 'space-between',
            content: <React.Fragment>
              <Button onClick={this.volverInicio} variant="outlined" color="primary" className={classes.button}>
                <Icon className={classNames(classes.iconoBotonAtras, classes.secondaryColor)}>arrow_back_ios</Icon>
                Atrás</Button>

              <Button onClick={this.agregarDatosExtras} variant="outlined" color="primary" className={classes.button}>
                Guardar
                <Icon className={classNames(classes.iconoBotonAtras, classes.secondaryColor)}>check</Icon>
              </Button>
            </React.Fragment>
          }}>

          <Grid container>
            <Grid item xs={12} sm={12} className={classes.marginBetween}>
              <MiInput
                onChange={this.onChangeInput}
                onFocusOut={this.onFocusOutInput}
                id={'InputHabilidades'}
                tipoInput={'textarea'}
                type={'text'}
                value={InputHabilidades && InputHabilidades.value || ''}
                error={InputHabilidades && InputHabilidades.error || false}
                mensajeError={InputHabilidades && InputHabilidades.mensajeError || 'Campo erroneo'}
                label={'Habilidades'}
              />
            </Grid>
            <br /><br /><br />
            <Grid item xs={12} sm={12} className={classes.marginBetween}>
              <MiInput
                onChange={this.onChangeInput}
                onFocusOut={this.onFocusOutInput}
                id={'InputIdiomas'}
                tipoInput={'textarea'}
                type={'text'}
                value={InputIdiomas && InputIdiomas.value || ''}
                error={InputIdiomas && InputIdiomas.error || false}
                mensajeError={InputIdiomas && InputIdiomas.mensajeError || 'Campo erroneo'}
                label={'Idiomas'}
              />
            </Grid>
            <br /><br /><br />
            <Grid item xs={12} sm={12} className={classes.marginBetween}>
              <MiInput
                onChange={this.onChangeInput}
                onFocusOut={this.onFocusOutInput}
                id={'InputReferencias'}
                tipoInput={'textarea'}
                type={'text'}
                value={InputReferencias && InputReferencias.value || ''}
                error={InputReferencias && InputReferencias.error || false}
                mensajeError={InputReferencias && InputReferencias.mensajeError || 'Campo erroneo'}
                label={'Referencias'}
              />
            </Grid>

          </Grid>
        </MiCard>
      </React.Fragment>
    );
  }
}

const styles = theme => ({
  container: {
    display: 'inline-block',
    margin: '10px'
  },
  textoLink: {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
    marginLeft: '20px',
  },
  button: {
    marginTop: '6px',
    float: 'right'
  },
  iconoBoton: {
    fontSize: '16px',
    lineHeight: '14px',
    marginRight: '4px',
  },
  secondaryColor: {
    color: theme.color.ok.main,
  },
  marginBetween: {
    margin: '5px auto'
  }
});

let componente = FormDatosExtrasCV;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
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

//Material UI
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Icon from '@material-ui/core/Icon';

//Mis Componentes
import MiInput from "@Componentes/MiInput";
import { onInputChangeValidateForm, onInputFocusOutValidateForm, validateForm } from "@Componentes/MiInput";

import MiControledDialog from "@Componentes/MiControledDialog";
import CardExperienciaLaboral from '@ComponentesExperienciaLaboral/CardExperienciaLaboral'

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
  }
});

class FormDatosExtrasCV extends React.PureComponent {
  constructor(props) {
    super(props);

    const datos = props.loggedUser.datos;

    this.state = {
      openForm: false,
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
          mensajeError: 'Este campo es opcional y debe contener 11 números.'
        }
      ]
    };
  }

  onDialogoOpen = () => {
    let formInputs = this.state.formInputs;
    formInputs.map((inputs) => {
      inputs.value = inputs.value;
      inputs.error = false;
    });

    this.setState({
      openForm: true,
      formInputs: _.cloneDeep(formInputs)
    });
  }

  onDialogoClose = () => {
    this.setState({ openForm: false });
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

    this.onDialogoClose();
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

  render() {
    const {
      classes
    } = this.props;

    const {
      openForm,
      formInputs
    } = this.state;

    //Set inputs
    const InputHabilidades = _.find(formInputs, { id: 'InputHabilidades' });
    const InputIdiomas = _.find(formInputs, { id: 'InputIdiomas' });
    const InputReferencias = _.find(formInputs, { id: 'InputReferencias' });

    return (
      <React.Fragment>
        <MiControledDialog
          open={openForm}
          onDialogoOpen={this.onDialogoOpen}
          onDialogoClose={this.onDialogoClose}
          titulo={'Agregar datos adicionales'}
          buttonAction={true}
          buttonOptions={{
            labelAccept: 'Agregar',
            onDialogoAccept: this.agregarDatosExtras,
            onDialogoCancel: this.onDialogoClose
          }}
        >
          <div key="buttonAction">
            <Button onClick={this.onDialogoOpen} variant="outlined" color="primary" size="small" className={classes.button}>
              <Icon className={classNames(classes.iconoBoton, classes.secondaryColor)}>assignment</Icon>
              Datos adicionales
                </Button>
          </div>
          <div key="mainContent">
            <Grid container>
              <Grid item xs={12} sm={12}>
                <MiInput
                  onChange={this.onChangeInput}
                  onFocusOut={this.onFocusOutInput}
                  id={'InputHabilidades'}
                  tipoInput={'input'}
                  type={'text'}
                  value={InputHabilidades && InputHabilidades.value || ''}
                  error={InputHabilidades && InputHabilidades.error || false}
                  mensajeError={InputHabilidades && InputHabilidades.mensajeError || 'Campo erroneo'}
                  label={'Descripción de las habilidades'}
                  placeholder={'Describa sus habilidades...'}
                  multiline={true}
                />
              </Grid>
              <br /><br /><br />
              <Grid item xs={12} sm={12}>
                <MiInput
                  onChange={this.onChangeInput}
                  onFocusOut={this.onFocusOutInput}
                  id={'InputIdiomas'}
                  tipoInput={'input'}
                  type={'text'}
                  value={InputIdiomas && InputIdiomas.value || ''}
                  error={InputIdiomas && InputIdiomas.error || false}
                  mensajeError={InputIdiomas && InputIdiomas.mensajeError || 'Campo erroneo'}
                  label={'Descripción de idiomas'}
                  placeholder={'Describa los idiomas y su nivel...'}
                  multiline={true}
                />
              </Grid>
              <br /><br /><br />
              <Grid item xs={12} sm={12}>
                <MiInput
                  onChange={this.onChangeInput}
                  onFocusOut={this.onFocusOutInput}
                  id={'InputReferencias'}
                  tipoInput={'input'}
                  type={'text'}
                  value={InputReferencias && InputReferencias.value || ''}
                  error={InputReferencias && InputReferencias.error || false}
                  mensajeError={InputReferencias && InputReferencias.mensajeError || 'Campo erroneo'}
                  label={'Descripción de referencias'}
                  placeholder={'Describa sus referencias...'}
                  multiline={true}
                />
              </Grid>
            </Grid>
          </div>
        </MiControledDialog>
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
    marginTop: '6px'
  },
  iconoBoton: {
    fontSize: '16px',
    lineHeight: '14px',
    marginRight: '4px',
  },
  secondaryColor: {
    color: theme.color.ok.main,
  },
});

let componente = FormDatosExtrasCV;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
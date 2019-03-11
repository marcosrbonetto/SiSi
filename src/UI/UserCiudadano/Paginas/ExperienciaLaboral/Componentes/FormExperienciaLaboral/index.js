import React from "react";
import { withRouter } from "react-router-dom";

import _ from "lodash";

//Styles
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import classNames from "classnames";

//Redux
import { mostrarCargando } from '@Redux/Actions/mainContent'
import { mostrarAlerta, dateToString } from "@Utils/functions";

//Material UI
import Grid from "@material-ui/core/Grid";

//Mis Componentes
import MiInput from "@Componentes/MiInput";
import { onInputChangeValidateForm, onInputFocusOutValidateForm, validateForm } from "@Componentes/MiInput";

import MiControledDialog from "@Componentes/MiControledDialog";
import CardExperienciaLaboral from '@ComponentesExperienciaLaboral/CardExperienciaLaboral'


const mapStateToProps = state => {
  return {
    loggedUser: state.Usuario.loggedUser,
    paraMobile: state.MainContent.paraMobile,
  };
};

const mapDispatchToProps = dispatch => ({
  mostrarCargando: (cargar) => {
    dispatch(mostrarCargando(cargar));
  }
});

class FormExperienciaLaboral extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      openForm: false,
      formInputs: [
        {
          id: 'InputNombreEmpresa',
          value: '',
          initValue: '',
          valiateCondition: /^.{0,50}$/,
          error: false,
          required: true,
          mensajeError: 'Este campo es obligatorio y tiene un límite de 50 catacteres.'
        },
        {
          id: 'InputDescripcionEmpresa',
          value: '',
          initValue: '',
          valiateCondition: /^.{0,150}$/,
          error: false,
          required: true,
          mensajeError: 'Este campo es obligatorio y tiene un límite de 150 catacteres.'
        },
        {
          id: 'InputDatosContactoEmpresa',
          value: '',
          initValue: '',
          valiateCondition: /^.{0,150}$/,
          error: false,
          required: true,
          mensajeError: 'Este campo es obligatorio y tiene un límite de 150 catacteres.'
        },
        {
          id: 'InputCuitEmpresa',
          value: '',
          initValue: '',
          valiateCondition: /^[0-9]{11}$/,
          error: false,
          required: false,
          mensajeError: 'Este campo es opcional y debe contener 11 números.'
        },
        {
          id: 'InputCargoActividadEmpresa',
          value: '',
          initValue: '',
          valiateCondition: /^.{0,150}$/,
          error: false,
          required: true,
          mensajeError: 'Este campo es obligatorio y tiene un límite de 150 catacteres.'
        },
        {
          id: 'InputFechaInicioEmpresa',
          value: new Date(),
          initValue: new Date(),
          disabled: false,
          error: false,
          required: true,
          mensajeError: 'La fecha de inicio debe ser mayor a la fecha fin.'
        },
        {
          id: 'InputFechaFinEmpresa',
          value: new Date(),
          initValue: new Date(),
          disabled: true,
          error: false,
          required: false
        }
      ]
    };
  }

  onDialogoOpen = () => {
    let formInputs = this.state.formInputs;
    formInputs.map((inputs) => {
      inputs.value = inputs.initValue;
      inputs.error = false;
    });
    
    this.setState({ 
      openForm: true,
      formInputs : _.cloneDeep(formInputs)
    });
  }

  onDialogoClose = () => {
    this.setState({ openForm: false });
  }

  onChangeInput = (value, type, input, props) => {

    const newformInputs = onInputChangeValidateForm(this.state.formInputs, {value, type, input, props});

    this.setState({
      formInputs : newformInputs
    });
  }

  onFocusOutInput = (input, props) => {

    const newformInputs = onInputFocusOutValidateForm(this.state.formInputs, {input, props});

    this.setState({
      formInputs : newformInputs
    });
  }

  validateForm = () => {

    const resultValidation = validateForm(this.state.formInputs);

    let formHayError = resultValidation.formHayError;
    let formInputs = resultValidation.formInputs;

    //Conditions between inputs
    const InputFechaInicioEmpresa = _.find(formInputs, { id: 'InputFechaInicioEmpresa' });
    const InputFechaFinEmpresa = _.find(formInputs, { id: 'InputFechaFinEmpresa' });

    if(InputFechaInicioEmpresa.value && InputFechaFinEmpresa.value && 
      InputFechaInicioEmpresa.disabled == false && InputFechaFinEmpresa.disabled == false && 
      InputFechaInicioEmpresa.value.getTime() > InputFechaFinEmpresa.value.getTime()) {
      InputFechaInicioEmpresa.error = true;
      InputFechaFinEmpresa.error = true;
      
      formHayError = true;
    } else {
      InputFechaInicioEmpresa.error = false;
      InputFechaFinEmpresa.error = false;
    }

    this.setState({
      formInputs : _.cloneDeep(formInputs)
    });
      
    return formHayError;
  }

  getExperienciaLaboral = () => {
    let formInputs = this.state.formInputs;
    const InputNombreEmpresa = _.find(formInputs, { id: 'InputNombreEmpresa' });
    const InputDescripcionEmpresa = _.find(formInputs, { id: 'InputDescripcionEmpresa' });
    const InputDatosContactoEmpresa = _.find(formInputs, { id: 'InputDatosContactoEmpresa' });
    const InputCuitEmpresa = _.find(formInputs, { id: 'InputCuitEmpresa' });
    const InputCargoActividadEmpresa = _.find(formInputs, { id: 'InputCargoActividadEmpresa' });
    const InputFechaInicioEmpresa = _.find(formInputs, { id: 'InputFechaInicioEmpresa' });
    const InputFechaFinEmpresa = _.find(formInputs, { id: 'InputFechaFinEmpresa' });

    const nuevaExpLab = {
      nombre: InputNombreEmpresa.value,
      descripcion: InputDescripcionEmpresa.value,
      contacto: InputDatosContactoEmpresa.value,
      cuit: InputCuitEmpresa.value,
      cargo: InputCargoActividadEmpresa.value,
      fechaInicio: !InputFechaInicioEmpresa.disabled ? dateToString(InputFechaInicioEmpresa.value, 'DD/MM/YYYY') : null,
      fechaFinalizacion: !InputFechaFinEmpresa.disabled ? dateToString(InputFechaFinEmpresa.value, 'DD/MM/YYYY') : null,
    };

    return nuevaExpLab;
  }

  agregarExperienciaLaboral = () => { 
    const formHayError = this.validateForm();
    
    if(formHayError) {
      mostrarAlerta('Se han encontrado campos erroneos.');
      return false;
    }

    const experienciaLaboralAgregada = this.getExperienciaLaboral();

    this.setState({ openForm: false },() => {
      this.props.handleExperienciaLaboralAgregada && this.props.handleExperienciaLaboralAgregada(experienciaLaboralAgregada);
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
    const InputNombreEmpresa = _.find(formInputs, { id: 'InputNombreEmpresa' });
    const InputDescripcionEmpresa = _.find(formInputs, { id: 'InputDescripcionEmpresa' });
    const InputDatosContactoEmpresa = _.find(formInputs, { id: 'InputDatosContactoEmpresa' });
    const InputCuitEmpresa = _.find(formInputs, { id: 'InputCuitEmpresa' });
    const InputCargoActividadEmpresa = _.find(formInputs, { id: 'InputCargoActividadEmpresa' });
    const InputFechaInicioEmpresa = _.find(formInputs, { id: 'InputFechaInicioEmpresa' });
    const InputFechaFinEmpresa = _.find(formInputs, { id: 'InputFechaFinEmpresa' });

    return (
      <React.Fragment>
        <MiControledDialog
            open={openForm}
            onDialogoOpen={this.onDialogoOpen}
            onDialogoClose={this.onDialogoClose}
            textoLink={'Agregar'}
            titulo={'Agregar experiencia laboral'}
            classTextoLink={classes.textoLink}
            buttonOptions={{
              labelAccept: 'Agregar',
              onDialogoAccept: this.agregarExperienciaLaboral,
              onDialogoCancel: this.onDialogoClose
            }}
          >
            <Grid container>
              <Grid item xs={12} sm={12}>
                <MiInput
                  onChange={this.onChangeInput}
                  onFocusOut={this.onFocusOutInput}
                  id={'InputNombreEmpresa'}
                  tipoInput={'input'}
                  type={'text'}
                  value={InputNombreEmpresa && InputNombreEmpresa.value || ''}
                  error={InputNombreEmpresa && InputNombreEmpresa.error || false}
                  mensajeError={InputNombreEmpresa && InputNombreEmpresa.mensajeError || 'Campo erroneo'}
                  label={'Nombre de la empresa'}
                  placeholder={'Ingrese el nombre de la empresa...'}
                />
              </Grid>
              <br /><br /><br />
              <Grid item xs={12} sm={12}>
                <MiInput
                  onChange={this.onChangeInput}
                  onFocusOut={this.onFocusOutInput}
                  id={'InputDescripcionEmpresa'}
                  tipoInput={'input'}
                  type={'text'}
                  value={InputDescripcionEmpresa && InputDescripcionEmpresa.value || ''}
                  error={InputDescripcionEmpresa && InputDescripcionEmpresa.error || false}
                  mensajeError={InputDescripcionEmpresa && InputDescripcionEmpresa.mensajeError || 'Campo erroneo'}
                  label={'Descripción de la empresa'}
                  placeholder={'Describa la actividad de la empresa...'}
                />
              </Grid>
              <br /><br /><br />
              <Grid item xs={12} sm={12}>
                <MiInput
                  onChange={this.onChangeInput}
                  onFocusOut={this.onFocusOutInput}
                  id={'InputDatosContactoEmpresa'}
                  tipoInput={'input'}
                  type={'text'}
                  value={InputDatosContactoEmpresa && InputDatosContactoEmpresa.value || ''}
                  error={InputDatosContactoEmpresa && InputDatosContactoEmpresa.error || false}
                  mensajeError={InputDatosContactoEmpresa && InputDatosContactoEmpresa.mensajeError || 'Campo erroneo'}
                  label={'Datos de contacto'}
                  placeholder={'Domicilio, Email, Teléfono, Referente...'}
                />
              </Grid>
              <br /><br /><br />
              <Grid item xs={12} sm={12}>
                <MiInput
                  onChange={this.onChangeInput}
                  onFocusOut={this.onFocusOutInput}
                  id={'InputCuitEmpresa'}
                  tipoInput={'input'}
                  type={'text'}
                  value={InputCuitEmpresa && InputCuitEmpresa.value || ''}
                  error={InputCuitEmpresa && InputCuitEmpresa.error || false}
                  mensajeError={InputCuitEmpresa && InputCuitEmpresa.mensajeError || 'Campo erroneo'}
                  label={'CUIT de la empresa'}
                  placeholder={'(Opcional) Si lo conoces, ingrese el CUIT de la empresa...'}
                />
              </Grid>
              <br /><br /><br />
              <Grid item xs={12} sm={12}>
                <MiInput
                  onChange={this.onChangeInput}
                  onFocusOut={this.onFocusOutInput}
                  id={'InputCargoActividadEmpresa'}
                  tipoInput={'input'}
                  type={'text'}
                  value={InputCargoActividadEmpresa && InputCargoActividadEmpresa.value || ''}
                  error={InputCargoActividadEmpresa && InputCargoActividadEmpresa.error || false}
                  mensajeError={InputCargoActividadEmpresa && InputCargoActividadEmpresa.mensajeError || 'Campo erroneo'}
                  label={'Cargo / Actividad'}
                  placeholder={'Ingrese el cargo y la actividad que realizaba en la empresa...'}
                />
              </Grid>
              <br /><br /><br />
              <Grid container>
                <Grid item xs={12} sm={6}>
                  <MiInput
                    onChange={this.onChangeInput}
                    onFocusOut={this.onFocusOutInput}
                    id={'InputFechaInicioEmpresa'}
                    tipoInput={'date'}
                    label={'Fecha de inicio'}
                    value={InputFechaInicioEmpresa && InputFechaInicioEmpresa.value || new Date()}
                    error={InputFechaInicioEmpresa && InputFechaInicioEmpresa.error || false}
                    mensajeError={InputFechaInicioEmpresa && InputFechaInicioEmpresa.mensajeError || 'Campo erroneo'}
                    withDisabled={true}
                    disabled={InputFechaInicioEmpresa && InputFechaInicioEmpresa.disabled != undefined ? InputFechaInicioEmpresa.disabled : true}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MiInput
                    onChange={this.onChangeInput}
                    onFocusOut={this.onFocusOutInput}
                    id={'InputFechaFinEmpresa'}
                    tipoInput={'date'}
                    label={'Fecha de fin'}
                    value={InputFechaFinEmpresa && InputFechaFinEmpresa.value || new Date()}
                    error={InputFechaFinEmpresa && InputFechaFinEmpresa.error || false}
                    mensajeError={InputFechaFinEmpresa && InputFechaFinEmpresa.mensajeError || ''}
                    withDisabled={true}
                    disabled={InputFechaFinEmpresa && InputFechaFinEmpresa.disabled != undefined ? InputFechaFinEmpresa.disabled : true}
                  />
                </Grid>
              </Grid>
            </Grid>
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
  }
});

let componente = FormExperienciaLaboral;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
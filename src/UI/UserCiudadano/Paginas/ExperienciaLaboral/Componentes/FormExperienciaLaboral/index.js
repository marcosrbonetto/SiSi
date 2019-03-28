import React from "react";
import { withRouter } from "react-router-dom";

import _ from "lodash";

//Styles
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import classNames from "classnames";

//Redux
import { mostrarCargando } from '@Redux/Actions/mainContent'
import { mostrarAlerta, dateToString, stringToDate } from "@Utils/functions";

//Material UI
import Grid from "@material-ui/core/Grid";
import Icon from '@material-ui/core/Icon';
import Button from "@material-ui/core/Button";

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

    var date = new Date();
    date.setDate(date.getDate() - 1);
    var yesterdayDate = date;

    this.state = {
      openForm: false,
      itemToEdit: null,
      formInputs: [
        {
          id: 'InputNombreEmpresa',
          serviceField: 'nombre',
          tipoInput: 'input',
          type: 'text',
          value: '',
          initValue: '',
          valiateCondition: /^.{0,250}$/,
          error: false,
          required: false,
          mensajeError: 'Este campo tiene un límite de 50 catacteres.'
        },
        {
          id: 'InputDescripcionEmpresa',
          serviceField: 'descripcion',
          tipoInput: 'input',
          type: 'text',
          value: '',
          initValue: '',
          valiateCondition: /^.{0,250}$/,
          error: false,
          required: false,
          mensajeError: 'Este campo tiene un límite de 250 catacteres.'
        },
        {
          id: 'InputDatosContactoEmpresa',
          serviceField: 'contacto',
          tipoInput: 'input',
          type: 'text',
          value: '',
          initValue: '',
          valiateCondition: /^.{0,250}$/,
          error: false,
          required: false,
          mensajeError: 'Este campo tiene un límite de 250 catacteres.'
        },
        {
          id: 'InputCuitEmpresa',
          serviceField: 'cuit',
          tipoInput: 'input',
          type: 'text',
          value: '',
          initValue: '',
          valiateCondition: /^[0-9]{11}$/,
          error: false,
          required: false,
          mensajeError: 'Este debe contener 11 números.'
        },
        {
          id: 'InputCargoActividadEmpresa',
          serviceField: 'cargo',
          tipoInput: 'input',
          type: 'text',
          value: '',
          initValue: '',
          valiateCondition: /^.{0,250}$/,
          error: false,
          required: false,
          mensajeError: 'Este campo tiene un límite de 250 catacteres.'
        },
        {
          id: 'InputFechaInicioEmpresa',
          serviceField: 'fechaInicio',
          tipoInput: 'date',
          type: 'date',
          value: null,
          initValue: null,
          disabled: false,
          initDisabled: false,
          error: false,
          required: true,
          mensajeError: 'La fecha es obligatoria y debe ser menor a la fecha fin.'
        },
        {
          id: 'InputFechaFinEmpresa',
          serviceField: 'fechaFinalizacion',
          tipoInput: 'date',
          type: 'date',
          value: null,
          initValue: null,
          disabled: true,
          initDisabled: true,
          error: false,
          required: false,
          mensajeError: 'La fecha debe ser mayor a la fecha inicio.'
        }
      ]
    };
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.itemToEdit) != JSON.stringify(nextProps.itemToEdit) &&
      nextProps && nextProps.itemToEdit instanceof Object) {

      let formInputs = _.cloneDeep(this.state.formInputs);
      //Reseteamos los valores por defecto
      formInputs.map((inputs) => {
        inputs.value = inputs.initValue;
        inputs.error = false;

        if(inputs.initDisabled)
          inputs.disabled = inputs.initDisabled;

      });

      Object.keys(nextProps.itemToEdit).map((field) => {
        let currentField = _.find(formInputs, { serviceField: field });

        if (currentField) {
          if(currentField.tipoInput == 'date')
            currentField.value = nextProps.itemToEdit[field] != null ? stringToDate(nextProps.itemToEdit[field]) : null;
          else
            currentField.value = nextProps.itemToEdit[field];

          if(currentField.value && currentField.disabled != undefined) //Si hay valor por defecto no esta deshabilidato
            currentField.disabled = false;
        }
      });

      this.setState({
        openForm: true,
        itemToEdit: nextProps.itemToEdit,
        formInputs: formInputs
      });
    }
  }

  onDialogoOpen = () => {
    let formInputs = this.state.formInputs;
    formInputs.map((inputs) => {
      inputs.value = inputs.initValue;
      inputs.error = false;

      if(inputs.initDisabled)
        inputs.disabled = inputs.initDisabled;
    });

    this.setState({
      openForm: true,
      formInputs: _.cloneDeep(formInputs)
    });
  }

  onDialogoClose = () => {
    this.setState({ openForm: false, itemToEdit: null });

    this.props.handleOnCloseDialog && this.props.handleOnCloseDialog();
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

    if (!formHayError) {
      //Conditions between inputs
      const InputFechaInicioEmpresa = _.find(formInputs, { id: 'InputFechaInicioEmpresa' });
      const InputFechaFinEmpresa = _.find(formInputs, { id: 'InputFechaFinEmpresa' });

      if (InputFechaInicioEmpresa.value && InputFechaFinEmpresa.value &&
        InputFechaInicioEmpresa.disabled == false && InputFechaFinEmpresa.disabled == false &&
        InputFechaInicioEmpresa.value.getTime() > InputFechaFinEmpresa.value.getTime()) {
        InputFechaInicioEmpresa.error = true;
        InputFechaFinEmpresa.error = true;

        formHayError = true;
      } else {
        InputFechaInicioEmpresa.error = false;
        InputFechaFinEmpresa.error = false;
      }
    }

    this.setState({
      formInputs: _.cloneDeep(formInputs)
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
      fechaInicio: !InputFechaInicioEmpresa.disabled && InputFechaInicioEmpresa.value ? dateToString(InputFechaInicioEmpresa.value, 'DD/MM/YYYY') : null,
      fechaFinalizacion: !InputFechaFinEmpresa.disabled && InputFechaFinEmpresa.value ? dateToString(InputFechaFinEmpresa.value, 'DD/MM/YYYY') : null,
    };

    return nuevaExpLab;
  }

  agregarExperienciaLaboral = () => {
    const formHayError = this.validateForm();

    if (formHayError) {
      mostrarAlerta('Se han encontrado campos erroneos.');
      return false;
    }

    const itemToEdit = this.state.itemToEdit;
    let experienciaLaboral = this.getExperienciaLaboral();

    this.setState({ openForm: false, itemToEdit: null }, () => {
      if(itemToEdit) {
        experienciaLaboral.id = itemToEdit.id;
        this.props.handleExperienciaLaboralModificada && this.props.handleExperienciaLaboralModificada(experienciaLaboral);
      } else {
        this.props.handleExperienciaLaboralAgregada && this.props.handleExperienciaLaboralAgregada(experienciaLaboral);
      }
    });
  }

  render() {
    const {
      classes
    } = this.props;

    const {
      openForm,
      formInputs,
      itemToEdit
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
          titulo={itemToEdit ? 'Modificar experiencia laboral' : 'Agregar experiencia laboral'}
          classTextoLink={classes.textoLink}
          buttonAction={true}
          buttonOptions={{
            labelAccept: itemToEdit ? 'Modificar' : 'Agregar',
            onDialogoAccept: this.agregarExperienciaLaboral,
            onDialogoCancel: this.onDialogoClose
          }}
        >
          <div key="buttonAction">
            <Button onClick={this.onDialogoOpen} variant="outlined" color="primary" className={classes.button}>
              Agregar
              <Icon className={classNames(classes.iconoBoton, classes.secondaryColor)}>add</Icon>
            </Button>
          </div>
          <div key="mainContent">
            <Grid container>
              <Grid item xs={12} sm={12}>
                <MiInput
                  onChange={this.onChangeInput}
                  onFocusOut={this.onFocusOutInput}
                  id={'InputNombreEmpresa'}
                  tipoInput={InputNombreEmpresa && InputNombreEmpresa.tipoInput || 'input'}
                  type={InputNombreEmpresa && InputNombreEmpresa.type || 'text'}
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
                  tipoInput={InputDescripcionEmpresa && InputDescripcionEmpresa.tipoInput || 'input'}
                  type={InputDescripcionEmpresa && InputDescripcionEmpresa.type || 'text'}
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
                  tipoInput={InputDatosContactoEmpresa && InputDatosContactoEmpresa.tipoInput || 'input'}
                  type={InputDatosContactoEmpresa && InputDatosContactoEmpresa.type || 'text'}
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
                  tipoInput={InputCuitEmpresa && InputCuitEmpresa.tipoInput || 'input'}
                  type={InputCuitEmpresa && InputCuitEmpresa.type || 'text'}
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
                  tipoInput={InputCargoActividadEmpresa && InputCargoActividadEmpresa.tipoInput || 'input'}
                  type={InputCargoActividadEmpresa && InputCargoActividadEmpresa.type || 'text'}
                  value={InputCargoActividadEmpresa && InputCargoActividadEmpresa.value || ''}
                  error={InputCargoActividadEmpresa && InputCargoActividadEmpresa.error || false}
                  mensajeError={InputCargoActividadEmpresa && InputCargoActividadEmpresa.mensajeError || 'Campo erroneo'}
                  label={'Cargo / Actividad'}
                  placeholder={'Ingrese el cargo y la actividad que realizaba en la empresa...'}
                />
              </Grid>
              <br /><br />
              <Grid container>
                <Grid item xs={12} sm={6}>
                  <MiInput
                    onChange={this.onChangeInput}
                    onFocusOut={this.onFocusOutInput}
                    id={'InputFechaInicioEmpresa'}
                    tipoInput={InputFechaInicioEmpresa && InputFechaInicioEmpresa.tipoInput || 'input'}
                    type={InputFechaInicioEmpresa && InputFechaInicioEmpresa.type || 'text'}
                    label={'Fecha de inicio'}
                    value={InputFechaInicioEmpresa && InputFechaInicioEmpresa.value || null}
                    error={InputFechaInicioEmpresa && InputFechaInicioEmpresa.error || false}
                    mensajeError={InputFechaInicioEmpresa && InputFechaInicioEmpresa.mensajeError || 'Campo erroneo'}
                    withDisabled={false}
                    disabled={InputFechaInicioEmpresa && InputFechaInicioEmpresa.disabled != undefined ? InputFechaInicioEmpresa.disabled : true}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MiInput
                    onChange={this.onChangeInput}
                    onFocusOut={this.onFocusOutInput}
                    id={'InputFechaFinEmpresa'}
                    tipoInput={InputFechaFinEmpresa && InputFechaFinEmpresa.tipoInput || 'input'}
                    type={InputFechaFinEmpresa && InputFechaFinEmpresa.type || 'text'}
                    label={'Fecha de fin'}
                    value={InputFechaFinEmpresa && InputFechaFinEmpresa.value || null}
                    error={InputFechaFinEmpresa && InputFechaFinEmpresa.error || false}
                    mensajeError={InputFechaFinEmpresa && InputFechaFinEmpresa.mensajeError || ''}
                    withDisabled={true}
                    disabled={InputFechaFinEmpresa && InputFechaFinEmpresa.disabled != undefined ? InputFechaFinEmpresa.disabled : true}
                  />
                </Grid>
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
  iconoBoton: {
    fontSize: '20px',
  },
});

let componente = FormExperienciaLaboral;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
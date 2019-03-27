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
import CardEstudiosRealizados from '@ComponentesEstudiosRealizados/CardEstudiosRealizados'

import { arrayTipoEstudios } from '@DatosEstaticos/EstudiosRealizados.js'

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

class FormEstudiosRealizados extends React.PureComponent {
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
          id: 'InputTipoEstudio',
          serviceField: 'tipoEstudio',
          tipoInput: 'select',
          type: 'select',
          value: 1,
          initValue: 1,
          error: false,
          required: true,
          mensajeError: 'Este campo es obligatorio.'
        },
        {
          id: 'InputNombreEstudio',
          serviceField: 'nombre',
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
          id: 'InputDescripcionEstudio',
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
          id: 'InputLugarCursadoEstudio',
          serviceField: 'lugarDeCursado',
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
          id: 'InputDuracionEstudio',
          serviceField: 'duracion',
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
          id: 'InputFechaInicioEstudio',
          serviceField: 'fechaInicio',
          tipoInput: 'date',
          type: 'date',
          value: null,
          initValue: null,
          initDisabled: false,
          disabled: false,
          error: false,
          required: true,
          mensajeError: 'La fecha es obligatoria y debe ser menor a la fecha fin.'
        },
        {
          id: 'InputFechaFinEstudio',
          serviceField: 'fechaFinalizacion',
          tipoInput: 'date',
          type: 'date',
          value: null,
          initValue: null,
          initDisabled: true,
          disabled: true,
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
      const InputFechaInicioEstudio = _.find(formInputs, { id: 'InputFechaInicioEstudio' });
      const InputFechaFinEstudio = _.find(formInputs, { id: 'InputFechaFinEstudio' });

      if (InputFechaInicioEstudio.value && InputFechaFinEstudio.value &&
        InputFechaInicioEstudio.disabled == false && InputFechaFinEstudio.disabled == false &&
        InputFechaInicioEstudio.value.getTime() > InputFechaFinEstudio.value.getTime()) {
        InputFechaInicioEstudio.error = true;
        InputFechaFinEstudio.error = true;

        formHayError = true;
      } else {
        InputFechaInicioEstudio.error = false;
        InputFechaFinEstudio.error = false;
      }
    }

    this.setState({
      formInputs: _.cloneDeep(formInputs)
    });

    return formHayError;
  }

  getEstudiosRealizados = () => {
    let formInputs = this.state.formInputs;
    const InputTipoEstudio = _.find(formInputs, { id: 'InputTipoEstudio' });
    const InputNombreEstudio = _.find(formInputs, { id: 'InputNombreEstudio' });
    const InputDescripcionEstudio = _.find(formInputs, { id: 'InputDescripcionEstudio' });
    const InputLugarCursadoEstudio = _.find(formInputs, { id: 'InputLugarCursadoEstudio' });
    const InputDuracionEstudio = _.find(formInputs, { id: 'InputDuracionEstudio' });
    const InputFechaInicioEstudio = _.find(formInputs, { id: 'InputFechaInicioEstudio' });
    const InputFechaFinEstudio = _.find(formInputs, { id: 'InputFechaFinEstudio' });

    const nuevaExpLab = {
      tipoEstudio: InputTipoEstudio.value,
      nombre: InputNombreEstudio.value,
      descripcion: InputDescripcionEstudio.value,
      lugarDeCursado: InputLugarCursadoEstudio.value,
      duracion: InputDuracionEstudio.value,
      fechaInicio: !InputFechaInicioEstudio.disabled && InputFechaInicioEstudio.value ? dateToString(InputFechaInicioEstudio.value, 'DD/MM/YYYY') : null,
      fechaFinalizacion: !InputFechaFinEstudio.disabled && InputFechaFinEstudio.value ? dateToString(InputFechaFinEstudio.value, 'DD/MM/YYYY') : null,
    };

    return nuevaExpLab;
  }

  agregarEstudiosRealizados = () => {
    const formHayError = this.validateForm();

    if (formHayError) {
      mostrarAlerta('Se han encontrado campos erroneos.');
      return false;
    }

    const itemToEdit = this.state.itemToEdit;
    let estudiosRealizado = this.getEstudiosRealizados(itemToEdit);

    this.setState({ openForm: false, itemToEdit: null }, () => {
      if(itemToEdit) {
        estudiosRealizado.id = itemToEdit.id;
        this.props.handleEstudiosRealizadosModificada && this.props.handleEstudiosRealizadosModificada(estudiosRealizado);
      } else {
        this.props.handleEstudiosRealizadosAgregada && this.props.handleEstudiosRealizadosAgregada(estudiosRealizado);
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
    const InputTipoEstudio = _.find(formInputs, { id: 'InputTipoEstudio' });
    const InputNombreEstudio = _.find(formInputs, { id: 'InputNombreEstudio' });
    const InputDescripcionEstudio = _.find(formInputs, { id: 'InputDescripcionEstudio' });
    const InputLugarCursadoEstudio = _.find(formInputs, { id: 'InputLugarCursadoEstudio' });
    const InputDuracionEstudio = _.find(formInputs, { id: 'InputDuracionEstudio' });
    const InputFechaInicioEstudio = _.find(formInputs, { id: 'InputFechaInicioEstudio' });
    const InputFechaFinEstudio = _.find(formInputs, { id: 'InputFechaFinEstudio' });

    return (
      <React.Fragment>
        <MiControledDialog
          open={openForm}
          onDialogoOpen={this.onDialogoOpen}
          onDialogoClose={this.onDialogoClose}
          titulo={itemToEdit ? 'Modificar estudio realizado' : 'Agregar estudio realizado'}
          classTextoLink={classes.textoLink}
          buttonAction={true}
          buttonOptions={{
            labelAccept: itemToEdit ? 'Modificar' : 'Agregar',
            onDialogoAccept: this.agregarEstudiosRealizados,
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
                  id={'InputTipoEstudio'}
                  tipoInput={InputTipoEstudio && InputTipoEstudio.tipoInput || 'input'}
                  type={InputTipoEstudio && InputTipoEstudio.type || 'text'}
                  label={''}
                  error={InputTipoEstudio && InputTipoEstudio.error || false}
                  mensajeError={InputTipoEstudio && InputTipoEstudio.mensajeError || ''}
                  withDisabled={true}
                  disabled={InputTipoEstudio && InputTipoEstudio.disabled != undefined ? InputTipoEstudio.disabled : true}
                  value={InputTipoEstudio && InputTipoEstudio.value || 1}
                  itemsSelect={arrayTipoEstudios}
                />
              </Grid>
              <br /><br /><br />
              <Grid item xs={12} sm={12}>
                <MiInput
                  onChange={this.onChangeInput}
                  onFocusOut={this.onFocusOutInput}
                  id={'InputNombreEstudio'}
                  tipoInput={InputNombreEstudio && InputNombreEstudio.tipoInput || 'input'}
                  type={InputNombreEstudio && InputNombreEstudio.type || 'text'}
                  value={InputNombreEstudio && InputNombreEstudio.value || ''}
                  error={InputNombreEstudio && InputNombreEstudio.error || false}
                  mensajeError={InputNombreEstudio && InputNombreEstudio.mensajeError || 'Campo erroneo'}
                  label={'Nombre del estudio'}
                  placeholder={'Ingrese el nombre del estudio...'}
                />
              </Grid>
              <br /><br /><br />
              <Grid item xs={12} sm={12}>
                <MiInput
                  onChange={this.onChangeInput}
                  onFocusOut={this.onFocusOutInput}
                  id={'InputDescripcionEstudio'}
                  tipoInput={InputDescripcionEstudio && InputDescripcionEstudio.tipoInput || 'input'}
                  type={InputDescripcionEstudio && InputDescripcionEstudio.type || 'text'}
                  value={InputDescripcionEstudio && InputDescripcionEstudio.value || ''}
                  error={InputDescripcionEstudio && InputDescripcionEstudio.error || false}
                  mensajeError={InputDescripcionEstudio && InputDescripcionEstudio.mensajeError || 'Campo erroneo'}
                  label={'Descripción del estudio'}
                  placeholder={'Describa la actividad del estudio...'}
                />
              </Grid>
              <br /><br /><br />
              <Grid item xs={12} sm={12}>
                <MiInput
                  onChange={this.onChangeInput}
                  onFocusOut={this.onFocusOutInput}
                  id={'InputLugarCursadoEstudio'}
                  tipoInput={InputLugarCursadoEstudio && InputLugarCursadoEstudio.tipoInput || 'input'}
                  type={InputLugarCursadoEstudio && InputLugarCursadoEstudio.type || 'text'}
                  value={InputLugarCursadoEstudio && InputLugarCursadoEstudio.value || ''}
                  error={InputLugarCursadoEstudio && InputLugarCursadoEstudio.error || false}
                  mensajeError={InputLugarCursadoEstudio && InputLugarCursadoEstudio.mensajeError || 'Campo erroneo'}
                  label={'Lugar de Cursado'}
                  placeholder={'Describa el lugar cursado...'}
                />
              </Grid>
              <br /><br /><br />
              <Grid container>
                <Grid item xs={12} sm={12}>
                  <MiInput
                    onChange={this.onChangeInput}
                    onFocusOut={this.onFocusOutInput}
                    id={'InputDuracionEstudio'}
                    tipoInput={InputDuracionEstudio && InputDuracionEstudio.tipoInput || 'input'}
                    type={InputDuracionEstudio && InputDuracionEstudio.type || 'text'}
                    value={InputDuracionEstudio && InputDuracionEstudio.value || ''}
                    error={InputDuracionEstudio && InputDuracionEstudio.error || false}
                    mensajeError={InputDuracionEstudio && InputDuracionEstudio.mensajeError || 'Campo erroneo'}
                    label={'Duracion'}
                    placeholder={'Cantidad de horas/dias/meses/años...'}
                  />
                </Grid>
              </Grid>
              <br /><br />
              <Grid container>
                <Grid item xs={12} sm={6}>
                  <MiInput
                    onChange={this.onChangeInput}
                    onFocusOut={this.onFocusOutInput}
                    id={'InputFechaInicioEstudio'}
                    tipoInput={InputFechaInicioEstudio && InputFechaInicioEstudio.tipoInput || 'input'}
                    type={InputFechaInicioEstudio && InputFechaInicioEstudio.type || 'text'}
                    label={'Fecha de inicio'}
                    value={InputFechaInicioEstudio && InputFechaInicioEstudio.value || null}
                    error={InputFechaInicioEstudio && InputFechaInicioEstudio.error || false}
                    mensajeError={InputFechaInicioEstudio && InputFechaInicioEstudio.mensajeError || 'Campo erroneo'}
                    withDisabled={false}
                    disabled={InputFechaInicioEstudio && InputFechaInicioEstudio.disabled != undefined ? InputFechaInicioEstudio.disabled : true}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MiInput
                    onChange={this.onChangeInput}
                    onFocusOut={this.onFocusOutInput}
                    id={'InputFechaFinEstudio'}
                    tipoInput={InputFechaFinEstudio && InputFechaFinEstudio.tipoInput || 'input'}
                    type={InputFechaFinEstudio && InputFechaFinEstudio.type || 'text'}
                    label={'Fecha de fin'}
                    value={InputFechaFinEstudio && InputFechaFinEstudio.value || null}
                    error={InputFechaFinEstudio && InputFechaFinEstudio.error || false}
                    mensajeError={InputFechaFinEstudio && InputFechaFinEstudio.mensajeError || ''}
                    withDisabled={true}
                    disabled={InputFechaFinEstudio && InputFechaFinEstudio.disabled != undefined ? InputFechaFinEstudio.disabled : true}
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

let componente = FormEstudiosRealizados;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
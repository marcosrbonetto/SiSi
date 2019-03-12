import React from "react";
import { withRouter } from "react-router-dom";
import _ from "lodash";

//Styles
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import classNames from "classnames";

//Redux
import { mostrarCargando } from '@Redux/Actions/mainContent'
import { actualizarPreinscipcion } from '@Redux/Actions/usuario';

//Material UI
import Divider from '@material-ui/core/Divider';
import Button from "@material-ui/core/Button";
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';

//Mis Componentes
import MiCard from "@Componentes/MiNewCard";
import MiInput from "@Componentes/MiInput";
import IndicadorCargando from "@UI/_Componentes/IndicadorCargando"
import { onInputChangeValidateForm, onInputFocusOutValidateForm, validateForm } from "@Componentes/MiInput";

import { mostrarAlerta, mostrarMensaje } from "@Utils/functions";

import MiControledDialog from "@Componentes/MiControledDialog";

import Rules_Preinscripcion from "@Rules/Rules_Preinscripcion";

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
  actualizarPreinscipcion: (data) => {
    dispatch(actualizarPreinscipcion(data));
  }
});

class SeleccionCurso extends React.PureComponent {
  constructor(props) {
    super(props);

    const arrayCursos = props.arrayCursos || [];

    this.state = {
      dialogoOpen: false,
      dialogoOpenInfoCurso: false,
      dialogTituloCurso: null,
      dialogInformacionCurso: null,
      dialogoOpenInfoPreInscripcion: false,
      inputBuscador: '',
      cursos: arrayCursos,
      listaCursos: arrayCursos,
      cursoPreinscripto: '',
      enfilaDeEspera: false,
      cargandoVisible: false,
      cursoSeleccionado: undefined,
      checkEmpresa: 'noEmpresa',
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
          id: 'InputCuitEmpresa',
          value: '',
          initValue: '',
          valiateCondition: /^[0-9]{11}$/,
          error: false,
          required: false,
          mensajeError: 'Este campo es opcional y debe contener 11 números.'
        },
        {
          id: 'InputContactoEmpresa',
          value: '',
          initValue: '',
          valiateCondition: /^.{0,20}$/,
          error: false,
          required: true,
          mensajeError: 'Este campo es obligatorio y tiene un límite de 150 catacteres.'
        },
      ]
    };
  }

  componentWillMount() {

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

    this.setState({
      formInputs: resultValidation.formInputs
    });

    return resultValidation.formHayError;
  }

  handleChangeCheckEmpresa = (event) => {
    this.setState({ checkEmpresa: event.target.value });
  }

  onDialogoOpen = () => {
    this.setState({ dialogoOpen: true });
  }

  onDialogoClose = () => {
    this.setState({ dialogoOpen: false });
  }

  onDialogoOpenInfoCurso = () => {
    this.setState({ dialogoOpenInfoCurso: true });
  }

  onDialogoCloseInfoCurso = () => {
    this.setState({
      dialogoOpenInfoCurso: false
    });
  }

  onDialogoOpenInfoPreInscripcion = () => {
    this.setState({ dialogoOpenInfoPreInscripcion: true });
  }

  onDialogoCloseInfoPreInscripcion = () => {
    this.setState({ dialogoOpenInfoPreInscripcion: false }, () => {
      this.props.cambioEstadoPreinscripcion && this.props.cambioEstadoPreinscripcion(true);
    });
  }

  onDialogoEliminarPreInscripcion = () => {
    this.onDialogoClose();

    this.props.mostrarCargando(true);
    const token = this.props.loggedUser.token;

    Rules_Preinscripcion.deletePreinscripcion(token)
      .then((datos) => {
        this.props.mostrarCargando(false);

        if (!datos.ok) {
          mostrarAlerta(datos.error);
          return false;
        }

        this.props.actualizarPreinscipcion(null);
        this.setState({ dialogoOpenInfoPreInscripcion: false }, () => {
          this.props.cambioEstadoPreinscripcion && this.props.cambioEstadoPreinscripcion(false);
        });
      })
      .catch((error) => {
        this.props.mostrarCargando(false);
        mostrarAlerta('Ocurrió un error al intentar desinscribirte.');
        console.error('Error Servicio "Rules_Preinscripcion.deletePreinscripcion": ' + error);
      });
  }

  onChangeInputBusqueda = (value) => {
    var inputValue = value;
    var arrayCursosFiltrados = this.getCursosFiltrados(inputValue);

    this.setState({
      inputBuscador: inputValue,
      listaCursos: arrayCursosFiltrados
    });
  }

  getCursosFiltrados = (inputValue) => {
    var stateArrayCursos = this.state.cursos;

    if (inputValue == '')
      return stateArrayCursos;
    else
      return _.filter(stateArrayCursos, (item) => { return (item.nombre + (item.lugar && " - " + item.lugar)).toLowerCase().indexOf(inputValue.toLowerCase()) != -1 });
  }

  onClickCurso = (event) => {
    var idCurso = event.currentTarget.attributes.idCurso.value;
    idCurso = !isNaN(idCurso) ? parseInt(idCurso) : idCurso;
    var cursos = this.state.cursos;

    var cursoSeleccionado = _.find(cursos, { id: idCurso });

    if (cursoSeleccionado) {

      let informacionCurso = '¿Esta seguro que desea preinscribirse a este curso?';
      
      if(cursoSeleccionado.descripcion1 != null || cursoSeleccionado.descripcion2 != null) {
        informacionCurso = <React.Fragment>
          {cursoSeleccionado.descripcion1 != null &&
          <React.Fragment><b>¿Qué aprenderás?</b><br/>
          {cursoSeleccionado.descripcion1}</React.Fragment>}
          
          {cursoSeleccionado.descripcion1 != null && cursoSeleccionado.descripcion2 != null && <React.Fragment><br/><br/></React.Fragment>}

          {cursoSeleccionado.descripcion2 != null &&
          <React.Fragment><b>¿Qué podrás hacer?</b><br/>
          {cursoSeleccionado.descripcion2}</React.Fragment>}
        </React.Fragment>;
      }

      this.setState({
        dialogoOpenInfoCurso: true,
        dialogTituloCurso: cursoSeleccionado.nombre + (cursoSeleccionado.lugar && ' - ' + cursoSeleccionado.lugar),
        dialogSubTituloCurso: (cursoSeleccionado.dia ? cursoSeleccionado.dia + " - " : '')+""+(cursoSeleccionado.horario ? cursoSeleccionado.horario : ''),
        dialogInformacionCurso: informacionCurso,
        cursoSeleccionado: cursoSeleccionado
      });
    }
  }

  procesarPreInscripcion = () => {

    this.setState({
      cargandoVisible: true
    }, () => {
      const token = this.props.loggedUser.token;
      const curso = this.state.cursoSeleccionado;
      const checkEmpresa = this.state.checkEmpresa;
      const formInputs = this.state.formInputs;

      if (!curso) {
        this.setState({
          cargandoVisible: false
        });
        return false;
      }

      let body = {
        "idCurso": curso.id,
        "tieneEmpresa": false,
        "nombreEmpresa": '',
        "cuitEmpresa": '',
        "domicilioEmpresa": '',
        "descripcionEmpresa": ''
      }

      if (curso &&
        curso.necesitaEmpresa &&
        checkEmpresa == 'siEmpresa') {

        const formHayError = this.validateForm();

        if (formHayError) {
          mostrarAlerta('Se han encontrado campos erroneos.');
          return false;
        }

        const InputNombreEmpresa = _.find(formInputs, { id: 'InputNombreEmpresa' });
        const InputDescripcionEmpresa = _.find(formInputs, { id: 'InputDescripcionEmpresa' });
        const InputCuitEmpresa = _.find(formInputs, { id: 'InputCuitEmpresa' });
        const InputContactoEmpresa = _.find(formInputs, { id: 'InputContactoEmpresa' });

        body = {
          "idCurso": curso.id,
          "tieneEmpresa": false,
          "nombreEmpresa": InputNombreEmpresa.value || '',
          "cuitEmpresa": InputCuitEmpresa.value || '',
          "domicilioEmpresa": InputContactoEmpresa.value || '',
          "descripcionEmpresa": InputDescripcionEmpresa.value || '',
        }
      }

      this.onDialogoCloseInfoCurso();

      Rules_Preinscripcion.insertPreinscripcion(token, body)
        .then((datos) => {
          if (!datos.ok) {
            this.setState({
              cargandoVisible: false,
              cursoSeleccionado: undefined
            });
            mostrarAlerta(datos.error);
            return false;
          }

          this.props.actualizarPreinscipcion(datos.return);


          let cursoPreinscripto = '';
          if(datos.return && datos.return.curso) {
            let lugar = '';
            let diaHorario = '';

            if(datos.return.curso.lugar)
              lugar = <React.Fragment> en {datos.return.curso.lugar}</React.Fragment>;

              if(datos.return.curso.dia)
              diaHorario = <React.Fragment> el {datos.return.curso.dia} {datos.return.curso.horario}</React.Fragment>;

            cursoPreinscripto = <React.Fragment>a <br/><span style={{fontWeight: '100'}}>{datos.return.curso.nombre}{lugar}{diaHorario}</span><br/></React.Fragment>;
          }

          this.setState({
            cargandoVisible: false,
            dialogoOpenInfoPreInscripcion: true,
            cursoPreinscripto: cursoPreinscripto,
            enfilaDeEspera: datos.return && datos.return.filaDeEspera,
            cursoSeleccionado: undefined
          });
        })
        .catch((error) => {
          this.setState({
            cargandoVisible: false,
            cursoSeleccionado: undefined
          });
          mostrarAlerta('Ocurrió un error al intentar preinscribirte.');
          console.error('Error Servicio "Rules_Preinscripcion.insertPreinscripcion": ' + error);
        });
    });

  }

  render() {
    const {
      classes,
      tituloCurso,
      textoBoton,
      textoBotonDialog,
      textoInformativo,
      classTituloCurso,
      classTextoInformativo,
      loggedUser
    } = this.props;

    const {
      dialogoOpen,
      listaCursos,
      inputBuscador,
      dialogoOpenInfoCurso,
      dialogTituloCurso,
      dialogSubTituloCurso,
      dialogInformacionCurso,
      dialogoOpenInfoPreInscripcion,
      cursoPreinscripto,
      enfilaDeEspera,
      cursoSeleccionado,
      checkEmpresa,
      formInputs,
      cargandoVisible
    } = this.state;

    //Set inputs
    const InputNombreEmpresa = _.find(formInputs, { id: 'InputNombreEmpresa' });
    const InputDescripcionEmpresa = _.find(formInputs, { id: 'InputDescripcionEmpresa' });
    const InputCuitEmpresa = _.find(formInputs, { id: 'InputCuitEmpresa' });
    const InputContactoEmpresa = _.find(formInputs, { id: 'InputContactoEmpresa' });

    return (
      <React.Fragment>
        <IndicadorCargando visible={cargandoVisible} />
        <MiCard
          informacionAlerta={tituloCurso}
          classInformacionAlerta={classTituloCurso}
          seccionBotones={{
            align: 'center',
            content: <Button variant="contained" className={classes.buttonSiSi} onClick={this.onDialogoOpen}>{textoBoton || 'PRE - INSCRIBIRME'}</Button>
          }}
        >
          <Typography variant="subheading" className={classTextoInformativo}>{textoInformativo}</Typography>
        </MiCard>

        <MiControledDialog
          open={dialogoOpen}
          onDialogoOpen={this.onDialogoOpen}
          onDialogoClose={this.onDialogoClose}
          titulo={'Cursos'}
        >
          <MiInput
            onChange={this.onChangeInputBusqueda}
            icono={'search'}
            tipoInput={'input'}
            type={'text'}
            value={inputBuscador}
            placeholder={'Buscar cursos...'}
          />

          <List className={classes.lista}>
            {
              listaCursos && listaCursos.length &&
              listaCursos.map((curso) => {
                return <ListItem
                  className={classes.itemLista}
                  onClick={this.onClickCurso}
                  idCurso={curso.id}>
                  <ListItemText
                    primary={curso.nombre + (curso.lugar && " - " + curso.lugar)}
                    secondary={(curso.dia ? curso.dia + " - " : '')+""+(curso.horario ? curso.horario : '')}
                  />
                </ListItem>
              })
              ||
              <ListItem className={classes.itemLista}>
                <ListItemText
                  primary={'No se encontraron cursos'}
                />
              </ListItem>
            }
          </List>
        </MiControledDialog>

        <MiControledDialog
          open={dialogoOpenInfoCurso}
          onDialogoOpen={this.onDialogoOpenInfoCurso}
          onDialogoClose={this.onDialogoCloseInfoCurso}
          titulo={'Cursos del programa ' + dialogTituloCurso}
          subtitulo={dialogSubTituloCurso}
          botonera={
            <div className={classes.containerBotonera}>
              <Divider />
              <div className={classes.botonesBotonera}>
                <Button variant="outlined" color="primary" className={classes.button} onClick={this.onDialogoCloseInfoCurso}>Otro Curso</Button>
                <Button variant="contained" className={classes.buttonSiSi} onClick={this.procesarPreInscripcion}>{textoBotonDialog || 'PRE - INSCRIBIRME'}</Button>
              </div>
            </div>
          }
        >
          <div key="mainContent">
            {(cursoSeleccionado && cursoSeleccionado.necesitaEmpresa &&
              <React.Fragment>
                <b>¿Desea sugerir una empresa?</b>
                <RadioGroup
                  value={checkEmpresa}
                  onChange={this.handleChangeCheckEmpresa}
                >
                  <FormControlLabel style={{ height: '26px' }} value={'noEmpresa'} control={<Radio color="primary" />} label="No deseo sugerir una empresa" />
                  <FormControlLabel style={{ height: '26px' }} value={'siEmpresa'} control={<Radio color="primary" />} label="Deseo sugerir una empresa" />
                </RadioGroup>
                <br />
                {checkEmpresa == 'siEmpresa' &&
                  <React.Fragment>
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
                      <Grid container>
                        <Grid item xs={12} sm={6}>
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
                        <Grid item xs={12} sm={6}>
                          <MiInput
                            onChange={this.onChangeInput}
                            onFocusOut={this.onFocusOutInput}
                            id={'InputContactoEmpresa'}
                            tipoInput={'input'}
                            type={'text'}
                            value={InputContactoEmpresa && InputContactoEmpresa.value || ''}
                            error={InputContactoEmpresa && InputContactoEmpresa.error || false}
                            mensajeError={InputContactoEmpresa && InputContactoEmpresa.mensajeError || 'Campo erroneo'}
                            label={'Contacto de la empresa'}
                            placeholder={'Ingrese el contacto Cde la empresa...'}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <br />
                    <div className={classes.containerInfoEmpresa}>
                      <i className={classNames('material-icons', classes.classIconoInfo)}>info</i>
                      <Typography variant="body2">Para sugerir una empresa es OBLIGATORIO llenar la siguiente planilla en papel y acercarla al Centro de Empleo y Capacitación (Galería Cinerama Av. Colon 335 subsuelo) de 8:30 a 14:30 hs</Typography>                     
                    </div>
                    
                    <Button
                      href={'https://drive.google.com/file/d/1V1PZUlkCHhXhZhvQh_AKEjD4gszEESOF/view'}
                      target="_blank"
                      className={classes.buttonDescargaPlanilla}
                      >
                        Descargar Planilla
                      </Button>
                  </React.Fragment>
                }
              </React.Fragment>
            )
              || dialogInformacionCurso}
          </div>
        </MiControledDialog>


        <MiControledDialog
          open={dialogoOpenInfoPreInscripcion}
          onDialogoOpen={this.onDialogoOpenInfoPreInscripcion}
          onDialogoClose={this.onDialogoCloseInfoPreInscripcion}
          classContainterContent={classes.contenedorInfoPreInscripcion}
          botonera={true}
        >
          <Icon className={classes.iconoOKPreInscripcion}>check_circle_outline</Icon>
          <Typography variant={'title'} style={{ fontSize: '30px' }}>
            Tu preinscripción {cursoPreinscripto} fue realizada con éxito
          </Typography>
          <br />
          <Typography variant="subheading">
            Te enviamos un mail a {loggedUser.datos.email} con el comprobante del registro
          </Typography>
          <br /><br />
          {enfilaDeEspera &&
            <React.Fragment>
              <Typography variant="subheading">El curso al cual te preinscribiste ya tiene el cupo completo. Si lo deseas te podemos anotar en una lista de espera.</Typography><br /> <br />
              <Button variant="outlined" color="primary" className={classes.button} onClick={this.onDialogoEliminarPreInscripcion}>Elegir otro Curso</Button>
              <Button variant="contained" className={classes.onDialogoCloseInfoPreInscripcion} >{'Anotarme en la lista de espera'}</Button></React.Fragment>
          }
          {!enfilaDeEspera &&
            <React.Fragment>
              <Button variant="outlined" color="primary" className={classes.button} onClick={this.onDialogoCloseInfoPreInscripcion}>Finalizar</Button>
            </React.Fragment>
          }
        </MiControledDialog>
      </React.Fragment>
    );
  }
}

const styles = theme => ({
  bottomContent: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  button: {
    ...theme.button
  },
  buttonSiSi: {
    ...theme.buttonSiSi
  },
  itemLista: {
    minWidth: '400px',
    cursor: 'pointer',
    '&:hover': {
      background: '#e4e4e4'
    }
  },
  lista: {
    minHeight: '350px'
  },
  containerBotonera: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    '& > *': {
      width: '100%',
    }
  },
  botonesBotonera: {
    textAlign: 'center',
    margin: '12px auto',
    marginTop: '18px',
  },
  iconoOKPreInscripcion: {
    color: theme.color.ok.main,
    fontSize: '100px',
    display: 'block',
    margin: '0px auto',
  },
  contenedorInfoPreInscripcion: {
    textAlign: 'center',
    maxWidth: '500px',
  },
  classIconoInfo: {
    margin: '0px 14px 0px 0px',
    color: '#ffb300'
  },
  classIconoDownload: {
    margin: '0px 14px 0px 0px',
    color: theme.color.ok.main,
    textDecoration: 'none'
  },
  containerInfoEmpresa: {
    display: 'flex',
    alignItems: 'center'
  },
  buttonDescargaPlanilla: {
    color: theme.color.ok.main,
    textDecoration: 'underline',
    marginLeft: '24px'
  }
});

let componente = SeleccionCurso;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
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
import { push } from "connected-react-router";

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

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
  },
  redireccionar: url => {
    dispatch(push(url));
  },
});

class SeleccionPrograma extends React.PureComponent {
  constructor(props) {
    super(props);

    const arrayCursos = props.arrayCursos || [];
    let infoCurso;
    let cursosXTag;
    if (arrayCursos.length == 1) {
      infoCurso = this.getInfoCurso(arrayCursos[0]);
    } else {
      cursosXTag = _.groupBy(arrayCursos, (o) => { return o.tag });
      if (cursosXTag.null && Object.keys(cursosXTag).length == 1) cursosXTag = null;
    }

    this.state = {
      dialogoOpen: false,
      dialogoOpenInfoCurso: false,
      dialogTituloCurso: infoCurso ? infoCurso.dialogTituloCurso : null,
      dialogSubTituloCurso: infoCurso ? infoCurso.dialogSubTituloCurso : null,
      dialogInformacionCurso: infoCurso ? infoCurso.dialogInformacionCurso : null,
      cursoSeleccionado: infoCurso ? infoCurso.cursoSeleccionado : undefined,
      dialogoOpenInfoPreInscripcion: false,
      inputBuscador: '',
      cursos: arrayCursos,
      listaCursos: arrayCursos,
      cursosXTag: cursosXTag,
      cursoPreinscripto: '',
      enfilaDeEspera: false,
      cargandoVisible: false,
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

  componentDidMount() {
    
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

  handleFinalizar = () => {
    window.location.reload();
  }

  onDialogoEliminarPreInscripcion = () => {
    this.onDialogoClose();

    this.props.mostrarCargando(true);
    const token = this.props.loggedUser.token;

    let idCurso = 0;
    try {
      idCurso = this.props.loggedUser.datos.preinscripcion.curso.id;
    } catch (error) {
      idCurso = 0;
    }

    Rules_Preinscripcion.deletePreinscripcion(token, idCurso)
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
      return _.filter(stateArrayCursos, (item) => { return (item.nombre + (item.lugar ? " - " + item.lugar : '')).toLowerCase().indexOf(inputValue.toLowerCase()) != -1 });
  }

  onClickCurso = (event) => {
    var idCurso = event.currentTarget.attributes.idCurso.value;

    idCurso = !isNaN(idCurso) ? parseInt(idCurso) : idCurso;
    var cursos = this.state.cursos;

    var cursoSeleccionado = _.find(cursos, { id: idCurso });

    const infoCurso = this.getInfoCurso(cursoSeleccionado);

    this.setState({
      dialogoOpenInfoCurso: infoCurso.dialogoOpenInfoCurso,
      dialogTituloCurso: infoCurso.dialogTituloCurso,
      dialogSubTituloCurso: infoCurso.dialogSubTituloCurso,
      dialogInformacionCurso: infoCurso.dialogInformacionCurso,
      cursoSeleccionado: infoCurso.cursoSeleccionado,
    });
  }

  getInfoCurso = (cursoSeleccionado) => {

    if (cursoSeleccionado) {

      let informacionCurso = '¿Esta seguro que desea preinscribirse a este curso?';
      const hayDescripcion1 = cursoSeleccionado.descripcion1 != null && cursoSeleccionado.descripcion1 != '';
      const hayDescripcion2 = cursoSeleccionado.descripcion2 != null && cursoSeleccionado.descripcion2 != '';

      if (hayDescripcion1 || hayDescripcion2) {

        if (cursoSeleccionado.idPrograma != 10) {
          informacionCurso = `<span>\
            ${hayDescripcion1 ? cursoSeleccionado.descripcion1 : ''}
            ${hayDescripcion1 && hayDescripcion2 ? '<span><br /><br /></span>' : ''}
            ${hayDescripcion2 ? cursoSeleccionado.descripcion2 : ''}
          </span>`;
        } else {
          informacionCurso = `<span>\
            ${hayDescripcion1 ? `<span><b>¿Qué aprenderás?</b><br />${cursoSeleccionado.descripcion1}</span>` : ''}\
            ${hayDescripcion1 && hayDescripcion2 ? '<span><br /><br /></span>' : ''}\
            ${hayDescripcion2 ? `<span><b>¿Qué podrás hacer?</b><br />${cursoSeleccionado.descripcion2}</span>` : ''}\
          </span>`;
        }
      }

      return {
        dialogoOpenInfoCurso: true,
        dialogTituloCurso: cursoSeleccionado.nombre + (cursoSeleccionado.lugar ? ' - ' + cursoSeleccionado.lugar : ''),
        dialogSubTituloCurso: (cursoSeleccionado.dia ? cursoSeleccionado.dia + " - " : '') + "" + (cursoSeleccionado.horario ? cursoSeleccionado.horario : ''),
        dialogInformacionCurso: informacionCurso,
        cursoSeleccionado: cursoSeleccionado
      };
    } else {
      return false;
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
          this.setState({
            cargandoVisible: false,
          });
          return false;
        }

        const InputNombreEmpresa = _.find(formInputs, { id: 'InputNombreEmpresa' });
        const InputDescripcionEmpresa = _.find(formInputs, { id: 'InputDescripcionEmpresa' });
        const InputCuitEmpresa = _.find(formInputs, { id: 'InputCuitEmpresa' });
        const InputContactoEmpresa = _.find(formInputs, { id: 'InputContactoEmpresa' });

        body = {
          "idCurso": curso.id,
          "tieneEmpresa": true,
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
          if (datos.return && datos.return.curso) {
            let lugar = '';
            let diaHorario = '';

            if (datos.return.curso.lugar)
              lugar = <React.Fragment> en {datos.return.curso.lugar}</React.Fragment>;

            if (datos.return.curso.dia)
              diaHorario = <React.Fragment> el {datos.return.curso.dia} {datos.return.curso.horario}</React.Fragment>;

            cursoPreinscripto = <React.Fragment>a <br /><span style={{ fontWeight: '100' }}>{datos.return.curso.nombre}{lugar}{diaHorario}</span><br /></React.Fragment>;
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

  volverInicio = () => {
    this.props.redireccionar("/Inicio");
  }

  render() {
    const {
      classes,
      tituloCurso,
      textoBoton,
      textoBotonDialog,
      textoInformativo,
      tituloPrograma,
      classTituloCurso,
      classTituloPrograma,
      classTextoInformativo,
      loggedUser
    } = this.props;

    const {
      dialogoOpen,
      listaCursos,
      cursosXTag,
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

    const arrayCursosXTag = cursosXTag ? _.orderBy(Object.keys(cursosXTag), [], ['asc']) : [];

    const dialogInformacionCursoHTML = dialogInformacionCurso ? <div dangerouslySetInnerHTML={{ __html: dialogInformacionCurso }} /> : '';

    const textoInformativoHTML = textoInformativo ? <div dangerouslySetInnerHTML={{ __html: textoInformativo }} /> : '';

    return (
      <React.Fragment>
        <IndicadorCargando visible={cargandoVisible} />
        <MiCard
          informacionAlerta={tituloPrograma}
          classInformacionAlerta={classTituloPrograma}
          contentClassName={classes.infoPrograma}
          seccionBotones={{
            align: 'space-between',
            content: <React.Fragment>
              <Button onClick={this.volverInicio} variant="outlined" color="primary" className={classes.button}>
                <Icon className={classNames(classes.iconoBoton, classes.secondaryColor)}>arrow_back_ios</Icon>
                Atrás</Button>

              <Button onClick={listaCursos.length == 1 ? this.onDialogoOpenInfoCurso : this.onDialogoOpen} variant="outlined" color="primary" className={classes.button}>
              PRE - INSCRIBIRME</Button>
            </React.Fragment>
          }}
        >
          <Typography variant="subheading" className={classTextoInformativo}>{textoInformativoHTML}</Typography>
        </MiCard>

        <MiControledDialog
          open={dialogoOpen}
          onDialogoOpen={this.onDialogoOpen}
          onDialogoClose={this.onDialogoClose}
          titulo={arrayCursosXTag && arrayCursosXTag.length > 0 ? 'Categorias / Cursos' : 'Cursos'}
        >
          <div key="headerContent">
            {!(arrayCursosXTag && arrayCursosXTag.length) &&
              <MiInput
                onChange={this.onChangeInputBusqueda}
                icono={'search'}
                tipoInput={'input'}
                type={'text'}
                value={inputBuscador}
                placeholder={'Buscar cursos...'}
              />}
          </div>
          <div key="mainContent">
            {(arrayCursosXTag && arrayCursosXTag.length &&
              <section className={classes.containerPanelCategoria}>
                {arrayCursosXTag.map((categoria, index) => {
                  const cursos = cursosXTag[categoria];

                  return <ExpansionPanel className={classes.panelCategoria}>
                    <ExpansionPanelSummary className={classes.containerTituloCategoria} expandIcon={<ExpandMoreIcon className={classes.iconoCategoria} />}>
                      <Typography className={classes.tituloCategoria}>{categoria}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={classes.containerListaCursos}>
                      <List className={classes.lista}>
                        {
                          cursos && cursos.length &&
                          cursos.map((curso) => {
                            return <ListItem
                              className={classes.itemLista}
                              onClick={this.onClickCurso}
                              idCurso={curso.id}>
                              <ListItemText
                                primary={curso.nombre + (curso.lugar ? " - " + curso.lugar : '')}
                                secondary={(curso.dia ? curso.dia + " - " : '') + "" + (curso.horario ? curso.horario : '')}
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
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                })}
              </section>
            ) ||
              <List className={classes.lista}>
                {
                  listaCursos && listaCursos.length &&
                  listaCursos.map((curso) => {
                    return <ListItem
                      className={classes.itemLista}
                      onClick={this.onClickCurso}
                      idCurso={curso.id}>
                      <ListItemText
                        primary={curso.nombre + (curso.lugar ? " - " + curso.lugar : '')}
                        secondary={(curso.dia ? curso.dia + " - " : '') + "" + (curso.horario ? curso.horario : '')}
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
              </List>}
          </div>
          <div key="footerContent"></div>
        </MiControledDialog>

        <MiControledDialog
          open={dialogoOpenInfoCurso}
          onDialogoOpen={this.onDialogoOpenInfoCurso}
          onDialogoClose={this.onDialogoCloseInfoCurso}
          titulo={'Curso del programa ' + dialogTituloCurso}
          subtitulo={dialogSubTituloCurso}
          botonera={
            <div className={classes.containerBotonera}>
              <Divider />
              <div className={classes.botonesBotonera}>
                <Button variant="outlined" color="primary" className={classes.button} onClick={this.onDialogoCloseInfoCurso}>Otro Curso</Button> 
                <Button variant="outlined" color="primary" className={classes.button} onClick={this.procesarPreInscripcion}>PRE - INSCRIBIRME</Button>
              </div>
            </div>
          }
        >
          <div key="mainContent">
            {(cursoSeleccionado && cursoSeleccionado.necesitaEmpresa &&
              <React.Fragment>
                {dialogInformacionCursoHTML}
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
              || dialogInformacionCursoHTML}
          </div>
        </MiControledDialog>


        <MiControledDialog
          open={dialogoOpenInfoPreInscripcion}
          onDialogoOpen={this.onDialogoOpenInfoPreInscripcion}
          onDialogoClose={this.onDialogoCloseInfoPreInscripcion}
          classContainterContent={classes.contenedorInfoPreInscripcion}
          botonera={true}
        >
          {(enfilaDeEspera &&
            <Icon className={classes.iconoListaEsperaPreInscripcion}>error_outline</Icon>)
            || <Icon className={classes.iconoOKPreInscripcion}>check_circle_outline</Icon>}

          <Typography variant={'title'} style={{ fontSize: '30px' }}>
            Tu preinscripción {cursoPreinscripto} {enfilaDeEspera ? 'se encuentra en lista de espera' : 'fue realizada con éxito'}
          </Typography>
          <br />
          <Typography variant="subheading">
            Te enviamos un mail a {loggedUser.datos.email} con el comprobante del registro
          </Typography>
          <br />
          {enfilaDeEspera &&
            <React.Fragment>
              <Typography variant="subheading">El curso al cual te preinscribiste ya tiene el cupo completo por lo que actualmente se encuentra en lista de espera. Usted puede:</Typography><br />
              <Button variant="outlined" color="primary" className={classes.button} onClick={this.handleFinalizar} >Seguir en la lista de espera</Button>
              <Button variant="outlined" color="primary" className={classes.button} onClick={this.onDialogoEliminarPreInscripcion}>Cancelar preinscripción</Button>
            </React.Fragment>
          }
          {!enfilaDeEspera &&
            <React.Fragment>
              <Button variant="outlined" color="primary" className={classes.button} onClick={this.handleFinalizar}>Finalizar</Button>
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
  itemLista: {
    minWidth: '400px',
    cursor: 'pointer',
    '&:hover': {
      background: '#e4e4e4'
    }
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
  iconoBoton: {
    fontSize: '16px',
  },
  botonesBotonera: {
    textAlign: 'center',
    margin: '12px auto',
    marginTop: '18px',
  },
  iconoListaEsperaPreInscripcion: {
    color: '#ffb300',
    fontSize: '100px',
    display: 'block',
    margin: '0px auto',
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
  },
  panelCategoria: {
    background: theme.color.ok.main,
    borderRadius: '4px !important',
  },
  iconoCategoria: {
    color: '#fff'
  },
  tituloCategoria: {
    color: '#fff'
  },
  containerListaCursos: {
    background: '#fff'
  },
  containerTituloCategoria: {
    marginTop: '8px',
    borderRadius: '4px !important',
  },
  containerPanelCategoria: {
    marginBottom: '10px'
  },
  lista: {
    width: '100%'
  },
  infoPrograma: {
    maxHeight: '300px',
    overflowY: 'auto',
  }
});

let componente = SeleccionPrograma;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
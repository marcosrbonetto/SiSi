import React from "react";
import { withRouter } from "react-router-dom";
import CordobaFilesUtils from "@Utils/CordobaFiles";

import _ from "lodash";

//Styles
import styles from './styles'
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import classNames from "classnames";

//Redux
import { mostrarCargando } from '@Redux/Actions/mainContent'
import { push } from "connected-react-router";

//Assets
import Logo_SiSi from "@Assets/images/Logo_SiSi.png";

//Material UI 
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from "@material-ui/core/Avatar";
import Icon from '@material-ui/core/Icon';
import Divider from '@material-ui/core/Divider';
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

//Mis Componentes
import MiCard from "@Componentes/MiCard";

//Funciones
import { dateToString, calcularEdad } from "@Utils/functions"

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
  redireccionar: url => {
    dispatch(push(url));
  },
});

class Home extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      openOcupacionInfo: false
    };
  }

  componentWillMount() {

  }

  onModificarPerfil = () => {
    window.location.href = window.Config.URL_MI_PERFIL + "/#/?token=" + this.props.loggedUser.token + '&redirect=' + encodeURIComponent(window.Config.URL_ROOT + '/Inicio');
  };

  onClickPreinscipcion = () => {
    this.props.redireccionar('/Inicio/Programas');
  }

  onClickExperienciaLaboral = () => {
    this.props.redireccionar('/Inicio/ExperienciaLaboral');
  }

  onClickEstudiosRealizados = () => {
    this.props.redireccionar('/Inicio/EstudiosRealizados');
  }

  handleTooltipOpen = () => {
    this.setState({ openOcupacionInfo: true });
  };

  handleTooltipClose = () => {
    this.setState({ openOcupacionInfo: false });
  };

  handleChangeOcupacion = () => {
    window.location.href = window.Config.URL_MI_PERFIL + "/#/?token=" + this.props.loggedUser.token + '&seccion=datosExtra&seccionMensaje=Modifique su ocupación para mantener su perfil actualizado.&redirect=' + encodeURIComponent(window.Config.URL_ROOT + '/Inicio');
  }

  onClickDatosAdicionales = () => {
    this.props.redireccionar('/Inicio/FormDatosAdicionales');
  }

  onClickCV = () => {
    this.props.redireccionar('/Inicio/CurriculumVitae');
  }

  onClickMisInscripciones = () => {
    this.props.redireccionar('/Inicio/MisInscripciones');
  }

  onClickInscripcionVirtual = () => {
    this.props.redireccionar('/Inicio/ProgramasVirtuales');
  }

  render() {
    const { openOcupacionInfo } = this.state;
    const {
      classes,
      loggedUser
    } = this.props;

    const datosUsuario = loggedUser.datos;
    let urlFotoPerfil;

    if (datosUsuario) {
      urlFotoPerfil = CordobaFilesUtils.getUrlFotoMediana(datosUsuario.identificadorFotoPersonal, datosUsuario.sexoMasculino);
    }

    const fechaNacimiento = datosUsuario.fechaNacimiento && dateToString(new Date(datosUsuario.fechaNacimiento), 'DD/MM/YYYY') || '-'

    const tienePreinscripcion = datosUsuario.preinscripcion ? true : false;
    const programa = tienePreinscripcion && <span>Te preinscribiste a {datosUsuario.preinscripcion.curso.nombrePrograma}</span> || 'Todavía no te has preinscripto a ningún programa';

    const tieneInscripcionVirtuales = datosUsuario.preinscripcionesVirtuales.length > 0 ? true : false;
    const cantCursosVirtuales = tieneInscripcionVirtuales ? datosUsuario.preinscripcionesVirtuales.length : 0;
    const inscripcionVirtuales = tieneInscripcionVirtuales ? 'Actualmente está inscripto a ' + (cantCursosVirtuales > 0 ? cantCursosVirtuales + ' cursos virtuales.' : ' un curso virtual.' ) : 'Todavía no te has inscripto a ningún curso virtual';

    const tieneExperienciasLaborales = datosUsuario.experienciasLaborales.length > 0;
    const experienciasLaborales = tieneExperienciasLaborales && 'Actualmente posee ' + datosUsuario.experienciasLaborales.length + ' experencias laborales cargadas.' || 'No ha cargado experiencias laborales';

    const tieneEstudiosRealizados = datosUsuario.estudios.length > 0;
    const estudiosRealizados = tieneEstudiosRealizados && 'Actualmente posee ' + datosUsuario.estudios.length + ' estudios realizados cargados.' || 'No ha cargado estudios realizados';

    let tieneTrabajo = _.filter(datosUsuario.experienciasLaborales, (experienciaLaboral) => {
      return experienciaLaboral.fechaFinalizacion == '' || experienciaLaboral.fechaFinalizacion == null || experienciaLaboral.fechaFinalizacion == undefined;
    });
    const tieneTrabajoActualmente = tieneTrabajo.length > 0 && 'Actualmente con trabajo' || 'Actualmente sin trabajo';

    let ocupacion = datosUsuario.ocupacionId && datosUsuario.ocupacionNombre || 'Desocupado';
    ocupacion = (!datosUsuario.ocupacionId || datosUsuario.ocupacionId == 31) && tieneTrabajo.length > 0 ? <ClickAwayListener onClickAway={this.handleTooltipClose}><Tooltip open={openOcupacionInfo} classes={{ tooltip: classes.textTooltip }} title={<span>Segun sus experiencias laborales cargadas usted no se encuentra desocupado actualmente, actualice su ocupación de MuniOnline entrando <b style={{ cursor: 'pointer' }} onClick={this.handleChangeOcupacion}>aquí</b>.</span>} placement="bottom"><span onClick={this.handleTooltipOpen} >{ocupacion}<i className={classNames(classes.iconOcupacion, "material-icons")}>error</i></span></Tooltip></ClickAwayListener> : ocupacion;

    return (
      <div className={classes.mainContainer}>
        <Grid container spacing={16} justify="center">
          <Grid item xs={12} sm={8}>
            <MiCard>
              <img src={Logo_SiSi} width={150} height={84} /><br /><br />
              <Typography variant="body2" gutterBottom className={classes.informacion}>
                Bienvenido a tu perfil del programa Sí Estudio Sí Trabajo. Desde acá podés gestionar tus datos, experiencia, programa al que querés participar.<br /><br />
                <b>Los cursos de Si Si Presencial inician entre abril y mayo, se les informará oportunamente desde la dirección de empleo (consultar e-mails y verificar si esta cargado su teléfono para recibir las notificaciones correspondientes). <br /><br /> Los cursos del Si Si Virtual "Autogestionados" y Lenguaje de Señas Argentina: comienzan en mayo y serán notificados a medida que se vayan cerrando las aulas para que puedan acceder a la plataforma.</b><br /><br />
                Son 100.000 cursos gratuitos de formación profesional virtuales, 5.000 capacitaciones presenciales remuneradas para jóvenes de 18 a 24 años (curso introducción al trabajo), 5.000 cursos presenciales gratuitos para mayores de 24 años sin empleo y 10.000 prácticas laborales remuneradas para jovenes de 18 a 24 años.<br /><br />
                En Córdoba decimos Si Estudio Si Trabajo y queremos que vos seas protagonista.</Typography>
            </MiCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <MiCard>
              <div className={classes.leftContainer}>
                <Typography variant="subheading" color="inherit" className={classes.usuario}>
                  {datosUsuario &&
                    datosUsuario.apellido + ', ' + datosUsuario.nombre}
                </Typography>
              </div>

              <Avatar alt="Menu del usuario" src={urlFotoPerfil} className={classNames(classes.icono)} />

              <div className={classes.leftContainer}>
                <Icon className={classes.iconoDetalle}>insert_invitation</Icon>
                <Typography variant="body1">
                  {fechaNacimiento} ({calcularEdad(fechaNacimiento)} años)
              </Typography>
              </div>
              <div className={classes.leftContainer}>
                <svg viewBox="0 0 512 512" className={classes.iconoOcupacion}>
                    <path d="M494.86,367.136h-0.553V322.35c0-111.772-78.086-208.648-186.536-232.659c-0.576-5.779-3.05-11.155-7.161-15.41
                      c-4.941-5.114-11.578-7.931-18.69-7.931H230.08c-7.112,0-13.749,2.817-18.69,7.931c-4.11,4.255-6.585,9.631-7.161,15.41
                      C95.779,113.702,17.693,210.578,17.693,322.35v44.786H17.14c-9.452,0-17.14,7.689-17.14,17.14v11.278
                      c0,7.463,4.721,14.02,11.747,16.317C78.368,433.654,165.113,445.65,256,445.65s177.632-11.996,244.253-33.779
                      c7.026-2.297,11.747-8.854,11.747-16.317v-11.278C512,374.825,504.311,367.136,494.86,367.136z M223.32,85.806
                      c1.787-1.849,4.188-2.869,6.76-2.869h51.839c2.572,0,4.973,1.018,6.76,2.869c1.787,1.85,2.723,4.285,2.634,6.855l-7.626,221.166
                      c-0.176,5.09-4.302,9.077-9.394,9.077h-36.585c-5.092,0-9.218-3.987-9.394-9.076l-7.626-221.166
                      C220.598,90.09,221.533,87.656,223.32,85.806z M495.413,395.555c0,0.223-0.097,0.48-0.314,0.551
                      C430.097,417.358,345.183,429.063,256,429.063S81.903,417.358,16.902,396.104c-0.217-0.071-0.314-0.327-0.314-0.55v-11.278
                      c0-0.305,0.248-0.553,0.553-0.553H335.62c4.58,0,8.294-3.713,8.294-8.294c0-4.58-3.713-8.294-8.294-8.294H34.281V322.35
                      c0-83.355,46.677-157.8,117.156-195.572l17.996,125.979c0.592,4.137,4.139,7.122,8.201,7.122c0.39,0,0.785-0.028,1.183-0.084
                      c4.535-0.648,7.686-4.849,7.038-9.383l-18.75-131.258c11.941-5.228,24.463-9.437,37.467-12.521l7.165,207.768
                      c0.485,14.069,11.893,25.091,25.972,25.091h36.585c14.078,0,25.486-11.022,25.972-25.091l7.165-207.767
                      c13.003,3.085,25.526,7.294,37.467,12.521l-18.75,131.258c-0.647,4.535,2.504,8.735,7.038,9.383
                      c0.398,0.056,0.793,0.084,1.183,0.084c4.061,0,7.609-2.986,8.201-7.122l17.996-125.979
                      c70.479,37.771,117.156,112.215,117.156,195.571v44.786h-53.635c-4.58,0-8.294,3.713-8.294,8.294c0,4.58,3.713,8.294,8.294,8.294
                      h70.775c0.305,0,0.553,0.248,0.553,0.553V395.555z"/>
                    <path d="M388.701,367.136h-17.694c-4.58,0-8.294,3.713-8.294,8.294c0,4.58,3.713,8.294,8.294,8.294h17.694
                      c4.58,0,8.294-3.713,8.294-8.294C396.995,370.849,393.282,367.136,388.701,367.136z"/>
                    <path d="M193.439,303.484l-2.529-17.698c-0.648-4.535-4.846-7.686-9.383-7.038c-4.535,0.648-7.686,4.849-7.038,9.383l2.528,17.698
                      c0.592,4.137,4.139,7.122,8.201,7.122c0.39,0,0.785-0.028,1.183-0.084C190.936,312.219,194.087,308.018,193.439,303.484z"/>
                    <path d="M330.474,278.748c-4.535-0.649-8.735,2.504-9.383,7.038l-2.528,17.698c-0.647,4.535,2.504,8.735,7.038,9.383
                      c0.397,0.056,0.793,0.084,1.183,0.084c4.061,0,7.609-2.986,8.201-7.122l2.528-17.698
                      C338.159,283.597,335.008,279.396,330.474,278.748z"/>
                </svg>
                <Typography variant="body1">
                  {ocupacion}
                </Typography>
              </div>
              <div className={classes.leftContainer}>
                <Icon className={classes.iconoDetalle}>work</Icon>
                <Typography variant="body1">
                  {tieneTrabajoActualmente}
                </Typography>
              </div>

              <div className={classes.leftContainer}>
                <Button onClick={this.onModificarPerfil} variant="outlined" color="primary" size="small" className={classes.button}>
                  <Icon className={classNames(classes.iconoBoton, classes.secondaryColor)}>create</Icon>
                  Modificar
                </Button>
              </div>

              <br />
              <Divider />
              <br />

              <div>
                <Typography variant="body1" className={classes.titulo}>
                  SiSi Presencial
                </Typography>
                <Typography variant="body1">
                  {programa}
                </Typography>
                <Button onClick={this.onClickPreinscipcion} variant="outlined" color="primary" size="small" className={classes.button}>
                  <Icon className={classNames(classes.iconoBoton, classes.secondaryColor)}>{tienePreinscripcion ? 'list_alt' : 'create'}</Icon>
                  {tienePreinscripcion ? 'Ver Preinscripción' : 'Pre - Inscribirme'}
                </Button>
              </div>

              <br />
              <Divider />
              <br />

              <div>
                <Typography variant="body1" className={classes.titulo}>
                SiSi Virtual
                </Typography>
                <Typography variant="body1">
                  {inscripcionVirtuales}
                </Typography>
                <Button onClick={this.onClickInscripcionVirtual} variant="outlined" color="primary" size="small" className={classes.button}>
                  <Icon className={classNames(classes.iconoBoton, classes.secondaryColor)}>{'create'}</Icon>
                  {'Inscribirme'}
                </Button>
              </div>

              <br />
              <Divider />
              <br />

              <div>
                <Typography variant="body1" className={classes.titulo}>
                Mis Inscripciones
                </Typography>
                <Typography variant="body1">
                  Ingresa para ver tus inscripciones actuales.
                </Typography>
                <Button onClick={this.onClickMisInscripciones} variant="outlined" color="primary" size="small" className={classes.button}>
                  <Icon className={classNames(classes.iconoBoton, classes.secondaryColor)}>list_alt</Icon>
                  {'Ver Mis Inscripciones'}
                </Button>
              </div>

              <br />
              <Divider />
              <br />

              <div>
                <Typography variant="body1" className={classes.titulo}>
                  Experiencia laboral
                </Typography>
                <Typography variant="body1">
                  {experienciasLaborales}
                </Typography>
                <Button onClick={this.onClickExperienciaLaboral} variant="outlined" color="primary" size="small" className={classes.button}>
                  <Icon className={classNames(classes.iconoBoton, classes.secondaryColor)}>list_alt</Icon>
                  Ver Trabajos
                </Button>
              </div>

              <br />
              <Divider />
              <br />

              <div>
                <Typography variant="body1" className={classes.titulo}>
                  Estudios realizados
                </Typography>
                <Typography variant="body1">
                  {estudiosRealizados}
                </Typography>
                <Button onClick={this.onClickEstudiosRealizados} variant="outlined" color="primary" size="small" className={classes.button}>
                  <Icon className={classNames(classes.iconoBoton, classes.secondaryColor)}>list_alt</Icon>
                  Ver Estudios
                </Button>
              </div>

              <br />
              <Divider />
              <br />

              <div>
                <Typography variant="body1" className={classes.titulo}>
                  Descarga tu CV
                </Typography>
                <Typography variant="body1">
                  También puede agregar datos adicionales tales como habilidades, idiomas y/o referencias.
                </Typography>
                <div className={classes.inlineBoxes}>
                  <Button onClick={this.onClickDatosAdicionales} variant="outlined" color="primary" size="small" className={classes.button}>
                    <Icon className={classNames(classes.iconoBoton, classes.secondaryColor)}>list_alt</Icon>
                    Ver Datos Adicionales
                </Button> 
                  <Button onClick={this.onClickCV} variant="outlined" color="primary" size="small" className={classes.button}>
                    <Icon className={classNames(classes.iconoBoton, classes.secondaryColor)}>assignment_ind</Icon>
                    Ver CV
                </Button>
                </div>
              </div>

            </MiCard>


          </Grid>
        </Grid>
      </div>
    );
  }
}

let componente = Home;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
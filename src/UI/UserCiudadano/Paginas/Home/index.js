import React from "react";
import { withRouter } from "react-router-dom";
import CordobaFilesUtils from "@Utils/CordobaFiles";

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

//Mis Componentes
import MiCard from "@Componentes/MiCard";

//Funciones
import { dateToString,calcularEdad } from "@Utils/functions"

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

    };
  }

  componentWillMount() {

  }

  onModificarPerfil = () => {
    window.location.href = window.Config.URL_MI_PERFIL + "/#/?token=" + this.props.loggedUser.token;
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

  render() {
    const { 
      classes,
      loggedUser
    } = this.props;

    const datosUsuario = loggedUser.datos;
    let urlFotoPerfil;
    if (datosUsuario) {
      urlFotoPerfil = CordobaFilesUtils.getUrlFotoMediana(datosUsuario.identificadorFotoPersonal, datosUsuario.sexoMasculino);
    }

    const fechaNacimiento = datosUsuario.fechaNacimiento && dateToString(new Date(datosUsuario.fechaNacimiento),'DD/MM/YYYY') || '-'
    const ocupacion = datosUsuario.ocupacionId && datosUsuario.ocupacionNombre || 'Desocupado';
    const tieneTrabajoActualmente = datosUsuario.tieneTrabajoActualmente && 'Actualmente con trabajo' || 'Actualmente sin trabajo';
    
    const tienePreinscripcion = datosUsuario.preinscripcion ? true : false;
    const programa = tienePreinscripcion && <span>Te preinscribiste a {datosUsuario.preinscripcion.curso.nombrePrograma}</span> || 'Todavía no te has preinscripto a ningún programa';
    
    const tieneExperienciasLaborales = datosUsuario.experienciasLaborales.length > 0;
    const experienciasLaborales = tieneExperienciasLaborales && 'Actualmente posee ' +datosUsuario.experienciasLaborales.length+ ' experencias laborales cargadas.' || 'No ha cargado experiencias laborales';
    
    const tieneEstudiosRealizados = datosUsuario.estudios.length > 0;
    const estudiosRealizados = tieneEstudiosRealizados && 'Actualmente posee ' +datosUsuario.estudios.length+ ' estudios realizados cargadas.' || 'No ha cargado estudios realizados';
    
    return (
      <div className={classes.mainContainer}>
        <Grid container spacing={16} justify="center">
          <Grid item xs={12} sm={8}>
            <img src={Logo_SiSi} width={150} height={84} /><br /><br />
            <Typography variant="body2" gutterBottom className={classes.informacion}>
              Bienvenido a tu perfil del programa Sí Estudio Sí Trabajo. Desde acá podés gestionar tus datos, experiencia, programa al que querés participar.<br /><br />
              Son 60.000 cursos gratuitos de formación profesional virtuales, 3.000 capacitaciones presenciales remuneradas para jóvenes de 18 a 24 años, 1.000 cursos presenciales gratuitos para mayores de 24 años sin empleo y 2.000 prácticas laborales remuneradas.<br /><br />
              En Córdoba decimos Si Estudio Si Trabajo y queremos que vos seas protagonista.</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <MiCard>
              <div className={classes.centerContainer}>
                <Avatar alt="Menu del usuario" src={urlFotoPerfil} className={classNames(classes.icono)} />
                <Typography variant="subheading" color="inherit" className={classes.usuario}>
                  {datosUsuario &&
                    datosUsuario.apellido + ', ' + datosUsuario.nombre}
                </Typography>
              </div>
              <div className={classes.leftContainer}>
                <Icon className={classes.iconoDetalle}>insert_invitation</Icon>
                <Typography variant="body1">
                  {fechaNacimiento} ({calcularEdad(fechaNacimiento)} años)
              </Typography>
              </div>
              <div className={classes.leftContainer}>
                <Icon className={classes.iconoDetalle}>person</Icon>
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
                  Si Estudio, Si Trabajo
                </Typography>
                <Typography variant="body1">
                  {programa}
              </Typography>
              <Button onClick={this.onClickPreinscipcion} variant="outlined" color="primary" size="small" className={classes.button}>
                <Icon className={classNames(classes.iconoBoton, classes.secondaryColor)}>{tienePreinscripcion ? 'delete' : 'create'}</Icon>
                  {tienePreinscripcion ? 'Desinscribirme' : 'Inscribirme'}
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
                <Icon className={classNames(classes.iconoBoton, classes.secondaryColor)}>{tieneExperienciasLaborales ? 'list_alt' : 'create'}</Icon>
                {tieneExperienciasLaborales ? 'Ver' : 'Cargar'}
                </Button>
              </div>

              <br />
              <Divider />
              <br />

              <div>
                <Typography variant="body1" className={classes.titulo}>
                  Estidios realizados
                </Typography>
                <Typography variant="body1">
                  {estudiosRealizados}
              </Typography>
              <Button onClick={this.onClickEstudiosRealizados} variant="outlined" color="primary" size="small" className={classes.button}>
                <Icon className={classNames(classes.iconoBoton, classes.secondaryColor)}>{tieneEstudiosRealizados ? 'list_alt' : 'create'}</Icon>
                {tieneEstudiosRealizados ? 'Ver' : 'Cargar'}
                </Button>
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
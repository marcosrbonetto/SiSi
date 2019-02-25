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
    const { classes } = this.props;

    const datosUsuario = this.props.loggedUser.datos;
    let urlFotoPerfil;
    if (datosUsuario) {
      urlFotoPerfil = CordobaFilesUtils.getUrlFotoMediana(datosUsuario.identificadorFotoPersonal, datosUsuario.sexoMasculino);
    }

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
                  10/09/1990 (28 años)
              </Typography>
              </div>
              <div className={classes.leftContainer}>
                <Icon className={classes.iconoDetalle}>person</Icon>
                <Typography variant="body1">
                  Desocupado
              </Typography>
              </div>
              <div className={classes.leftContainer}>
                <Icon className={classes.iconoDetalle}>work</Icon>
                <Typography variant="body1">
                  Actualmente sin trabajo
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
                  Programa
                </Typography>
                <Typography variant="body1">
                  Te preinscribiste a Administración - Ingles - Nivel Básico
              </Typography>
              <Button onClick={this.onClickPreinscipcion} variant="outlined" color="primary" size="small" className={classes.button}>
                <Icon className={classNames(classes.iconoBoton, classes.secondaryColor)}>delete</Icon>
                Desinscribirme
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
                  No cargaste experiencias laborales
              </Typography>
              <Button onClick={this.onClickExperienciaLaboral} variant="outlined" color="primary" size="small" className={classes.button}>
                <Icon className={classNames(classes.iconoBoton, classes.secondaryColor)}>create</Icon>
                Modificar
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
                  No cargaste estudios realizados
              </Typography>
              <Button onClick={this.onClickEstudiosRealizados} variant="outlined" color="primary" size="small" className={classes.button}>
                <Icon className={classNames(classes.iconoBoton, classes.secondaryColor)}>create</Icon>
                Modificar
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
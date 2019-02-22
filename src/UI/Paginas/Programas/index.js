import React from "react";
import { withRouter } from "react-router-dom";

//Styles
import styles from './styles'
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import classNames from "classnames";

//Assets
import Logo_SiSi from "@Assets/images/Logo_SiSi.png";

//Redux
import { mostrarCargando } from '@Redux/Actions/mainContent'

//Material UI 
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from "@material-ui/core/Button";

//Componentes
import MiControledDialog from "@Componentes/MiControledDialog";
import SeleccionPrograma from '@ComponentesProgramas/SeleccionPrograma'

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

class Programas extends React.PureComponent {
  constructor(props) {
    super(props);

    this.tienePreInscripcion = true;

    this.state = {
      dialogoOpen: false
    };
  }

  componentWillMount() {

  }

  onDialogoOpen = () => {
    this.setState({ dialogoOpen: true });
  }

  onDialogoClose = () => {
    this.setState({ dialogoOpen: false });
  }

  aceptarDesinscripcion = () => {
      //TODO
  }

  cancelarDesinscripcion = () => {
    this.onDialogoClose();
  }

  render() {
    const { classes } = this.props;
    const { dialogoOpen } = this.state;
    
    return (
      <div className={classes.mainContainer}>
        <Grid container spacing={16} justify="center">

          {this.tienePreInscripcion &&
            <Grid item xs={12} sm={6} className={classes.containerTienePreInscripcion}>
              <img src={Logo_SiSi} width={150} height={84} className={classes.imgSiSi} /><br /><br />
              <Typography variant="body2" gutterBottom className={classes.informacion}>
                Ya estas Preinscripto a<br />
                <b>SERVICIOS Y COMERCIO - PELUQUERÍA INTEGRAL</b><br />
                Por lo que no vas a poder inscribirte a otro programa</Typography>
                <br/>
                <Button variant="outlined" color="primary" className={classes.button} onClick={this.onDialogoOpen}>Desinscribirme</Button>
            </Grid>
            ||
            <Grid item xs={12} sm={6}>


              <SeleccionPrograma
                tituloPrograma={'SI ESTUDIO +24'}
                classTituloPrograma={classes.tituloPrograma}
                textoInformativo={'1000 oportunidades para 38 Cursos de Formación Profesional (CFP) que dura 3 meses promedio.'}
              />

              <br /><br /><br />

              <SeleccionPrograma
                tituloPrograma={'SI TRABAJO'}
                classTituloPrograma={classes.tituloPrograma}
                textoInformativo={'Hasta 1000 Prácticas Laborales para egresados de los Cursos de Formación Profesional (CFP) en empresas oferentes o la empresa que nos propongas. Media jornada - 20 horas semanales (hasta 6 meses sin relación laboral - con una remuneración de $ 3600 por mes.'}
              />

            </Grid>}
        </Grid>

        <MiControledDialog
          open={dialogoOpen}
          onDialogoOpen={this.onDialogoOpen}
          onDialogoClose={this.onDialogoClose}
          titulo={'Desinscripción'}
          buttonOptions={{
            onDialogoAccept: this.aceptarDesinscripcion,
            onDialogoCancel: this.cancelarDesinscripcion
          }}
        >
          ¿Desea cancelar su preinscripción? Esta acción no se puedrá deshacer
        </MiControledDialog>
      </div>
    );
  }
}

let componente = Programas;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
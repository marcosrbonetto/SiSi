import React from "react";
import { withRouter } from "react-router-dom";

//Styles
import styles from './styles'
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import classNames from "classnames";

//Assets
import Logo_SiSi from "@Assets/images/Logo_SiSi.png";
import { mostrarAlerta, mostrarMensaje } from "@Utils/functions";

//Redux
import { mostrarCargando } from '@Redux/Actions/mainContent';
import { actualizarPreinscipcion } from '@Redux/Actions/usuario';

//Material UI 
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from "@material-ui/core/Button";
import Icon from '@material-ui/core/Icon';

//Componentes
import MiControledDialog from "@Componentes/MiControledDialog";
import SeleccionPrograma from '@ComponentesProgramas/SeleccionPrograma'

import Rules_Preinscripcion from "@Rules/Rules_Preinscripcion";
import Rules_Programas from "@Rules/Rules_Programas";

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

class Programas extends React.PureComponent {
  constructor(props) {
    super(props);

    this.estudioAlcanzadoNoConfig = !props.loggedUser.datos.estudioAlcanzadoId;

    this.state = {
      tienePreInscripcion: props.loggedUser.datos.preinscripcion ? true : false,
      dialogoOpen: false,
      listaProgramas: undefined
    };
  }

  componentDidMount() {
    this.cargarProgramas();
  }

  componentWillMount() {

  }

  onDialogoOpen = () => {
    this.setState({ dialogoOpen: true });
  }

  onDialogoClose = () => {
    this.setState({ dialogoOpen: false });
  }

  cambioEstadoPreinscripcion = (tienePreInscripcion) => {
    this.setState({
      tienePreInscripcion: tienePreInscripcion
    });
  }

  cargarProgramas = () => {
    this.props.mostrarCargando(true);
    const token = this.props.loggedUser.token;

    Rules_Programas.getProgramas(token)
      .then((datos) => {
        this.props.mostrarCargando(false);
        if (!datos.ok) {
          mostrarAlerta('Ocurrió un error al intentar obtener los programas.');
          return false;
        }

        this.setState({
          listaProgramas: datos.return
        });
      })
      .catch((error) => {
        mostrarAlerta('Ocurrió un error al intentar obtener los programas.');
        console.error('Error Servicio "Rules_Preinscripcion.getProgramas": ' + error);
      });
  }

  cancelarDesinscripcion = () => {
    this.onDialogoClose();
  }

  aceptarDesinscripcion = () => {
    this.onDialogoClose();

    this.props.mostrarCargando(true);
    const token = this.props.loggedUser.token;

    Rules_Preinscripcion.deletePreinscripcion(token)
      .then((datos) => {
        this.props.mostrarCargando(false);
        if (!datos.ok) {
          mostrarAlerta('Ocurrió un error al intentar desinscribirte.');
          return false;
        }

        this.setState({
          tienePreInscripcion: false
        }, () => {
          this.props.actualizarPreinscipcion(null);
          mostrarMensaje('Se ha desinscripto exitosamente!');
        });
      })
      .catch((error) => {
        mostrarAlerta('Ocurrió un error al intentar desinscribirte.');
        console.error('Error Servicio "Rules_Preinscripcion.deletePreinscripcion": ' + error);
      });
  }

  onClickModifDatosAdicionales = () => {
    window.location.href = window.Config.URL_MI_PERFIL + "/#/?token=" + this.props.loggedUser.token + '&seccion=datosExtra';
  }

  render() {
    const { classes } = this.props;
    const { tienePreInscripcion, dialogoOpen, listaProgramas } = this.state;

    return (
      <div className={classes.mainContainer}>
        <Grid container spacing={16} justify="center">

          {(this.estudioAlcanzadoNoConfig &&
            <Grid item xs={12} sm={6} className={classes.seccionCenter}>
              <Typography variant="body2" gutterBottom className={classes.informacion} style={{ textAlign: 'center' }}>
                Para poder mostrar los programas disponibles para usted, debe completar los datos adicionales de su perfil de Vecino Virtual.</Typography><br/>
                
                <Button onClick={this.onClickModifDatosAdicionales} variant="outlined" color="primary" size="small" className={classNames(classes.buttonModifDatosAdicionales)}>
                <Icon style={{lineHeight: '22px'}}>create</Icon>
                  {'Completar Datos Adicionales'}
                </Button>
            </Grid>)
            ||
            <React.Fragment>
              {tienePreInscripcion &&
                <Grid item xs={12} sm={6} className={classes.containerTienePreInscripcion}>
                  <img src={Logo_SiSi} width={150} height={84} className={classes.imgSiSi} /><br /><br />
                  <Typography variant="body2" gutterBottom className={classes.informacion}>
                    Ya estas Preinscripto a<br />
                    <b>SERVICIOS Y COMERCIO - PELUQUERÍA INTEGRAL</b><br />
                    Por lo que no vas a poder inscribirte a otro programa</Typography>
                  <br />
                  <Button variant="outlined" color="primary" className={classes.button} onClick={this.onDialogoOpen}>Desinscribirme</Button>
                </Grid>}

              {!tienePreInscripcion && listaProgramas &&
                <React.Fragment>
                  {listaProgramas.length > 0 &&

                    <Grid item xs={12} sm={6}>

                      {listaProgramas.map((programa) => {
                        return <React.Fragment>
                          <SeleccionPrograma
                            tituloPrograma={programa.nombre}
                            classTituloPrograma={classes.tituloPrograma}
                            textoInformativo={programa.descripcion}
                            arrayCursos={programa.cursos}
                            cambioEstadoPreinscripcion={this.cambioEstadoPreinscripcion}
                          />

                          <br /><br /><br />
                        </React.Fragment>
                      })}

                    </Grid>

                    ||
                    <Grid item xs={12} sm={12} className={classes.seccionCenter}>
                      <Typography variant="body2" gutterBottom className={classes.informacion} style={{ textAlign: 'center' }}>
                        De acuerdo a su estado actual, no se presentan programas disponibles par usted.</Typography>
                    </Grid>}
                </React.Fragment>}
            </React.Fragment>}
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
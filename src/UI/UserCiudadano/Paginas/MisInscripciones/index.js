import React from "react";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import { push } from "connected-react-router";

//Styles
import styles from './styles'
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import classNames from "classnames";

//Redux
import { mostrarCargando } from '@Redux/Actions/mainContent';
import { actualizarPreinscipcion, actualizarPreinscipcionesVirtuales } from '@Redux/Actions/usuario';

//Mis Componentes
import MiCard from "@Componentes/MiCard";
import MiControledDialog from "@Componentes/MiControledDialog";

//Material ui
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import CloseIcon from '@material-ui/icons/Close';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Typography from '@material-ui/core/Typography';
import Button from "@material-ui/core/Button";
import Icon from '@material-ui/core/Icon';

import Rules_Preinscripcion from "@Rules/Rules_Preinscripcion";
import Rules_CampusVirtual from "@Rules/Rules_CampusVirtual";

import { mostrarAlerta, mostrarMensaje } from "@Utils/functions";
import { Grid } from "@material-ui/core";

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
  actualizarPreinscipcionesVirtuales: (data) => {
    dispatch(actualizarPreinscipcionesVirtuales(data));
  },
  actualizarPreinscipcion: (data) => {
    dispatch(actualizarPreinscipcion(data));
  },
  redireccionar: url => {
    dispatch(push(url));
  },
});

class MisInscripciones extends React.PureComponent {
  constructor(props) {
    super(props);

    this.esPreinscripcionVirtual = null;
    this.idCursoADesinscribir = null;

    const misInscripcionesVirtuales = props.loggedUser.datos.preinscripcionesVirtuales || [];
    const miInscripcionPresencial = props.loggedUser.datos.preinscripcion ? [props.loggedUser.datos.preinscripcion] : [];

    this.state = {
      dialogoOpen: false,
      dialogoOpenAccesoDenegado: false,
      misInscripcionesVirtuales: misInscripcionesVirtuales,
      miInscripcionPresencial: miInscripcionPresencial
    };
  }

  aceptarDesinscripcion = () => {
    if (!this.idCursoADesinscribir ||
      this.esPreinscripcionVirtual == undefined ||
      this.esPreinscripcionVirtual == null) return false;

    const idCurso = this.idCursoADesinscribir;
    const esVirtual = this.esPreinscripcionVirtual;

    this.idCursoADesinscribir = null;
    this.esPreinscripcionVirtual = null;

    this.onDialogoClose();

    this.props.mostrarCargando(true);
    const token = this.props.loggedUser.token;

    Rules_Preinscripcion.deletePreinscripcion(token, idCurso)
      .then((datos) => {
        this.props.mostrarCargando(false);
        if (!datos.ok) {
          mostrarAlerta('Ocurrió un error al intentar desinscribirte.');
          return false;
        }

        if (esVirtual) {
          let rowList = _.cloneDeep(this.state.misInscripcionesVirtuales);
          let newRowList = _.filter(rowList, (o) => o.curso.id != idCurso);

          this.setState({
            misInscripcionesVirtuales: newRowList
          });

          this.props.actualizarPreinscipcionesVirtuales(newRowList);
        } else {

          this.setState({
            miInscripcionPresencial: []
          });

          this.props.actualizarPreinscipcion(null);
        }

        mostrarMensaje('Se ha desinscripto exitosamente!');
      })
      .catch((error) => {
        this.props.mostrarCargando(false);
        mostrarAlerta('Ocurrió un error al intentar desinscribirte.');
        console.error('Error Servicio "Rules_Preinscripcion.deletePreinscripcion": ' + error);
      });
  }

  onDialogoOpen = (event) => {
    const idCurso = event.currentTarget.attributes.idCurso.value;
    const esVirtual = event.currentTarget.attributes.esVirtual.value;
    if (!idCurso) return false;
    if (esVirtual == undefined || esVirtual == null) return false;

    this.idCursoADesinscribir = idCurso;
    this.esPreinscripcionVirtual = esVirtual == 'Si' ? true : false;

    this.setState({ dialogoOpen: true });
  }

  onDialogoClose = () => {
    this.idCursoADesinscribir = null;
    this.esPreinscripcionVirtual = null;

    this.setState({ dialogoOpen: false });
  }

  onDialogoOpenAccesoDenegado = () => {
    this.setState({ dialogoOpenAccesoDenegado: true });
  }

  onDialogoCloseAccesoDenegado = () => {
    this.setState({ dialogoOpenAccesoDenegado: false });
  }

  entrarAulaVirtual = () => {

    this.props.mostrarCargando(true);
    const token = this.props.loggedUser.token;

    Rules_CampusVirtual.iniciarSesionCampusVirtual(token)
      .then((datos) => {
        this.props.mostrarCargando(false);

        if (!datos.ok) {
          mostrarAlerta('Ocurrió un error al intentar obtener el acceso a Aula Virtual.');
          return false;
        }

        if (datos.return) {
          window.location.href = datos.return;
        } else {
          this.onDialogoOpenAccesoDenegado();
        }
      })
      .catch((error) => {
        this.props.mostrarCargando(false);
        mostrarAlerta('Ocurrió un error al intentar obtener el acceso a Aula Virtual.');
        console.error('Error Servicio "Rules_CampusVirtual.iniciarSesionCampusVirtual": ' + error);
      });
  }

  volverInicio = () => {
    this.props.redireccionar("/Inicio");
  }

  render() {
    const { classes } = this.props;
    const { dialogoOpen,
      dialogoOpenAccesoDenegado,
      miInscripcionPresencial,
      misInscripcionesVirtuales } = this.state;

    return (
      <div className={classes.mainContainer}>

        <Grid container justify={'center'}>
          <Grid item xs={12} sm={8}>

            <MiCard>
              <Typography variant="title" gutterBottom>Pre-inscripción Presencial</Typography>

              <List className={classes.root}>
                {miInscripcionPresencial &&
                  miInscripcionPresencial.length > 0 &&
                  miInscripcionPresencial.map((inscripcion) => {
                    const curso = inscripcion.curso;

                    return <ListItem>
                      <ListItemText primary={curso.nombre + ' ' + curso.lugar + (curso.dia ? curso.dia + " - " : '') + "" + (curso.horario ? curso.horario : '')} secondary={curso.tag + ' - ' + curso.nombrePrograma} />
                      <Avatar className={classes.iconDesinscripcion} idCurso={curso.id} esVirtual={'No'} onClick={this.onDialogoOpen}>
                        <CloseIcon />
                      </Avatar>
                    </ListItem>;
                  })}

                {(!miInscripcionPresencial ||
                  miInscripcionPresencial.length == 0) &&
                  <Typography variant="body1" gutterBottom className={classes.informacion} style={{ textAlign: 'center', marginBottom: '0px' }}>
                    No posee inscripción.</Typography>}

              </List>
            </MiCard>
            <br /><br />
            <MiCard>
              <Typography variant="title" gutterBottom>Inscripciones Virtuales</Typography>

              <List className={classes.root}>
                {misInscripcionesVirtuales &&
                  misInscripcionesVirtuales.length > 0 &&
                  misInscripcionesVirtuales.map((inscripcion) => {
                    const curso = inscripcion.curso;

                    return <ListItem>
                      <ListItemText primary={curso.nombre + ' ' + curso.lugar + (curso.dia ? curso.dia + " - " : '') + "" + (curso.horario ? curso.horario : '')} secondary={curso.tag.split(';')[0] + (curso.tag.split(';')[1] != undefined ? ' - ' + curso.tag.split(';')[1] : '') + ' - ' + curso.nombrePrograma} />
                      
                      {!inscripcion.habilitada &&
                      <Button onClick={this.onDialogoOpen} idCurso={curso.id} esVirtual={'Si'} variant="outlined" color="primary" className={classNames(classes.iconDesinscripcion)}>
                        Eliminar<br/>inscripcion
                      </Button>}
                      
                      <Button onClick={inscripcion.habilitada ? this.entrarAulaVirtual : this.onDialogoOpenAccesoDenegado} variant="outlined" color="primary" className={classNames(inscripcion.habilitada ? classes.iconoAcceso : classes.iconoAccesoDenegado)}>
                        Ir al<br/>Aula Virtual
                      </Button>
                    </ListItem>;
                  })}


                {(!misInscripcionesVirtuales ||
                  misInscripcionesVirtuales.length == 0) &&
                  <Typography variant="body1" gutterBottom className={classes.informacion} style={{ textAlign: 'center', marginBottom: '0px' }}>
                    No posee inscripciones.</Typography>}
              </List>

            </MiCard>

            <br />
            <div className={classes.textCenter}>
              <Button onClick={this.volverInicio} variant="outlined" color="primary" className={classes.button}>
                <Icon className={classNames(classes.iconoBoton, classes.secondaryColor)}>arrow_back_ios</Icon>
                Atrás</Button>
            </div>
          </Grid>
        </Grid>

        <MiControledDialog
          open={dialogoOpen}
          onDialogoOpen={this.onDialogoOpen}
          onDialogoClose={this.onDialogoClose}
          titulo={'Desinscripción'}
          buttonOptions={{
            onDialogoAccept: this.aceptarDesinscripcion,
            onDialogoCancel: this.onDialogoClose
          }}
        >
          ¿Desea cancelar su preinscripción?
        </MiControledDialog>

        <MiControledDialog
          open={dialogoOpenAccesoDenegado}
          onDialogoOpen={this.onDialogoOpenAccesoDenegado}
          onDialogoClose={this.onDialogoCloseAccesoDenegado}
          titulo={'Sin Acceso'}
        >
          {'Actualmente no tiene acceso al curso, verifique el'} <br /> {'calendario para corroborar el comienzo del mismo.'}
        </MiControledDialog>

      </div>
    );
  }
}

let componente = MisInscripciones;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
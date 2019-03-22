import React from "react";
import { withRouter } from "react-router-dom";

import { push } from "connected-react-router";

//Styles
import styles from './styles'
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import classNames from "classnames";

//Redux
import { mostrarCargando } from '@Redux/Actions/mainContent';
import { actualizarPreinscipcionesVirtuales } from '@Redux/Actions/usuario';

//Mis Componentes
import MiCard from "@Componentes/MiCard";
import MiControledDialog from "@Componentes/MiControledDialog";

//Material ui
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import CancelIcon from '@material-ui/icons/Cancel';

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
  actualizarPreinscipcionesVirtuales: (data) => {
    dispatch(actualizarPreinscipcionesVirtuales(data));
  },
  redireccionar: url => {
    dispatch(push(url));
  },
});

class MisInscripciones extends React.PureComponent {
  constructor(props) {
    super(props);

    this.idCursoADesinscribir = null;

    //const tienePreInscripcion = props.loggedUser.datos.preinscripcionVirtuales;
    const misinscripciones = props.loggedUser.datos.preinscripcion;

    this.state = {
      dialogoOpen: false,
      listaInscripciones: misinscripciones,
    };
  }

  aceptarDesinscripcion = (idCurso) => {
    if (!this.idCursoADesinscribir) return false;

    const idCurso = this.idCursoADesinscribir;

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

        let rowList = _.cloneDeep(this.state.listaInscripciones);
        let newRowList = _.filter(rowList, (o) => o.curso.id == idCurso);

        this.setState({
          listaInscripciones: newRowList
        });

        this.props.actualizarPreinscipcionesVirtuales(newRowList);
        mostrarMensaje('Se ha desinscripto exitosamente!');
      })
      .catch((error) => {
        mostrarAlerta('Ocurrió un error al intentar desinscribirte.');
        console.error('Error Servicio "Rules_Preinscripcion.deletePreinscripcion": ' + error);
      });
  }

  onDialogoOpen = (event) => {
    const idCurso = event.currentTarget.attributes.idCurso.value;
    if (!idCurso) return false;
    this.idCursoADesinscribir = idCurso;

    this.setState({ dialogoOpen: true });
  }

  onDialogoClose = () => {
    this.idCursoADesinscribir = null;

    this.setState({ dialogoOpen: false });
  }

  render() {
    const { classes } = this.props;
    const { dialogoOpen, listaInscripciones } = this.state;

    return (
      <div className={classes.mainContainer}>

        <MiCard titulo="Mis Inscripciones">
          <List className={classes.root}>
            {listaInscripciones &&
              listaInscripciones.map((inscripcion) => {
                const curso = inscripcion.curso;

                return <ListItem>
                  <ListItemText primary={curso.nombre + ' ' + curso.lugar + (curso.dia ? curso.dia + " - " : '') + "" + (curso.horario ? curso.horario : '')} secondary={curso.tag + ' - ' + curso.nombrePrograma} />
                  <Avatar onClick={this.onDialogoOpen}>
                    <CancelIcon />
                  </Avatar>
                </ListItem>;
              })}
          </List>
        </MiCard>

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

      </div>
    );
  }
}

const styles = theme => ({
  root: {
    width: '100%',
  }
});

let componente = MisInscripciones;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
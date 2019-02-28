import React from "react";
import { withRouter } from "react-router-dom";
import _ from "lodash";

//Styles
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import classNames from "classnames";

//Redux
import { mostrarCargando } from '@Redux/Actions/mainContent'

//Material UI
import Divider from '@material-ui/core/Divider';
import Button from "@material-ui/core/Button";
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';

//Mis Componentes
import MiCard from "@Componentes/MiNewCard";
import MiInput from "@Componentes/MiInput";

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
      cursoSeleccionado: undefined
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

  onDialogoOpenInfoCurso = () => {
    this.setState({ dialogoOpenInfoCurso: true });
  }

  onDialogoCloseInfoCurso = () => {
    this.setState({ 
      dialogoOpenInfoCurso: false,
      cursoSeleccionado: undefined
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
          mostrarAlerta('Ocurrió un error al intentar desinscribirte.');
          return false;
        }

        this.setState({ dialogoOpenInfoPreInscripcion: false });
      })
      .catch((error) => {
        mostrarAlerta('Ocurrió un error al intentar desinscribirte.');
        console.error('Error Servicio "Rules_Preinscripcion.deletePreinscripcion": ' + error);
      });
  }

  onChangeInputBusqueda = (event) => {
    var inputValue = event.target.value;
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
      return _.filter(stateArrayCursos, (item) => { return item.nombre.indexOf(inputValue) != -1 });
  }

  onClickCurso = (event) => {
    var idCurso = event.currentTarget.attributes.idCurso.value;
    idCurso = !isNaN(idCurso) ? parseInt(idCurso) : idCurso;
    var cursos = this.state.cursos;

    var cursoSeleccionado = _.find(cursos, { id: idCurso });

    if (cursoSeleccionado) {
      this.setState({
        dialogoOpenInfoCurso: true,
        dialogTituloCurso: cursoSeleccionado.nombreCurso,
        dialogInformacionCurso: cursoSeleccionado.observaciones || '¿Esta seguro que desea preinscribirse a este curso?',
        cursoSeleccionado: cursoSeleccionado
      });
    }
  }

  procesarPreInscripcion = () => {
    this.onDialogoCloseInfoCurso();

    this.props.mostrarCargando(true);
    const token = this.props.loggedUser.token;
    const curso = this.state.cursoSeleccionado;

    if(!curso) {
      this.props.mostrarCargando(false);
      return false;
    }

    const body = {
      "idCurso": curso.id,
      "tieneEmpresa": false,
      "nombreEmpresa": '',
      "cuitEmpresa": '',
      "domicilioEmpresa": '',
      "descripcionEmpresa": ''
    }

    Rules_Preinscripcion.insertPreinscripcion(token, body)
      .then((datos) => {
        this.props.mostrarCargando(false);
        if (!datos.ok) {
          mostrarAlerta('Ocurrió un error al intentar preinscribirte.');
          return false;
        }

        this.setState({
          dialogoOpenInfoPreInscripcion: true,
          cursoPreinscripto: datos.return && datos.return.curso && <span>a {datos.return.curso.nombreCurso}</span> || '',
          enfilaDeEspera: datos.return && datos.return.filaDeEspera
        });
      })
      .catch((error) => {
        mostrarAlerta('Ocurrió un error al intentar preinscribirte.');
        console.error('Error Servicio "Rules_Preinscripcion.insertPreinscripcion": ' + error);
      });

    //this.onDialogoOpenInfoPreInscripcion();
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
      dialogInformacionCurso,
      dialogoOpenInfoPreInscripcion,
      cursoPreinscripto,
      enfilaDeEspera
    } = this.state;

    return (
      <React.Fragment>
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
                    primary={curso.nombre}
                    secondary={curso.subtitulo ? curso.subtitulo : null}
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
          {dialogInformacionCurso}
        </MiControledDialog>


        <MiControledDialog
          open={dialogoOpenInfoPreInscripcion}
          onDialogoOpen={this.onDialogoOpenInfoPreInscripcion}
          onDialogoClose={this.onDialogoCloseInfoPreInscripcion}
          classContainterContent={classes.contenedorInfoPreInscripcion}
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
  }
});

let componente = SeleccionCurso;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
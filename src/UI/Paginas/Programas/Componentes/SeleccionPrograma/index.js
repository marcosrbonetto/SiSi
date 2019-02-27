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

class SeleccionPrograma extends React.PureComponent {
  constructor(props) {
    super(props);

    const arrayProgramas = props.arrayProgramas || [];

    this.state = {
      dialogoOpen: false,
      dialogoOpenInfoPrograma: false,
      dialogTituloPrograma: null,
      dialogInformacionPrograma: null,
      dialogoOpenInfoPreInscripcion: false,
      inputBuscador: '',
      programas: arrayProgramas,
      listaProgramas: arrayProgramas
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

  onDialogoOpenInfoPrograma = () => {
    this.setState({ dialogoOpenInfoPrograma: true });
  }

  onDialogoCloseInfoPrograma = () => {
    this.setState({ dialogoOpenInfoPrograma: false });
  }

  onDialogoOpenInfoPreInscripcion = () => {
    this.setState({ dialogoOpenInfoPreInscripcion: true });
  }

  onDialogoCloseInfoPreInscripcion = () => {
    this.setState({ dialogoOpenInfoPreInscripcion: false });
  }

  onChangeInputBusqueda = (event) => {
    var inputValue = event.target.value;
    var arrayProgramasFiltrados = this.getProgramasFiltrados(inputValue);

    this.setState({
      inputBuscador: inputValue,
      listaProgramas: arrayProgramasFiltrados
    });
  }

  getProgramasFiltrados = (inputValue) => {
    var stateArrayProgramas = this.state.programas;

    if (inputValue == '')
      return stateArrayProgramas;
    else
      return _.filter(stateArrayProgramas, (item) => { return item.nombre.indexOf(inputValue) != -1 });
  }

  onClickPrograma = (event) => {
    var idPrograma = event.currentTarget.attributes.idPrograma.value;
    idPrograma = !isNaN(idPrograma) ? parseInt(idPrograma) : idPrograma;
    var programas = this.state.programas;

    var programaSeleccionado = _.find(programas, { idPrograma: idPrograma });

    if (programaSeleccionado) {
      this.setState({
        dialogoOpenInfoPrograma: true,
        dialogTituloPrograma: programaSeleccionado.nombrePrograma,
        dialogInformacionPrograma: programaSeleccionado.observaciones || '¿Esta seguro que desea preinscribirse a este curso?',
      });
    }
  }

  procesarPreInscripcion = () => {
    this.onDialogoCloseInfoPrograma();

    this.props.mostrarCargando(true);
    const token = this.props.loggedUser.token;

    const body = {
      "idCurso": 0,
      "tieneEmpresa": true,
      "nombreEmpresa": "string",
      "cuitEmpresa": "string",
      "domicilioEmpresa": "string",
      "descripcionEmpresa": "string"
    }

    Rules_Preinscripcion.insertPreinscripcion(token, body)
      .then((datos) => {
        this.props.mostrarCargando(false);
        if (!datos.ok) {
          mostrarAlerta('Ocurrió un error al intentar preinscribirte.');
          return false;
        }

        if (estaEnListaEspera) {
          this.setState({
            dialogoOpenInfoPreInscripcion: true,
            programaPreinscripto: datos.return.curso && <span>a {datos.return.curso.nombrePrograma}</span> || '',
            enfilaDeEspera: datos.return.filaDeEspera
          });
        }
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
      tituloPrograma,
      textoBoton,
      textoBotonDialog,
      textoInformativo,
      classTituloPrograma,
      classTextoInformativo,
      loggedUser
    } = this.props;

    const {
      dialogoOpen,
      listaProgramas,
      inputBuscador,
      dialogoOpenInfoPrograma,
      dialogTituloPrograma,
      dialogInformacionPrograma,
      dialogoOpenInfoPreInscripcion,
      programaPreinscripto,
      enfilaDeEspera
    } = this.state;

    return (
      <React.Fragment>
        <MiCard
          informacionAlerta={tituloPrograma}
          classInformacionAlerta={classTituloPrograma}
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
          titulo={'Cursos del programa ' + tituloPrograma}
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
              listaProgramas && listaProgramas.length &&
              listaProgramas.map((programa) => {
                return <ListItem
                  className={classes.itemLista}
                  onClick={this.onClickPrograma}
                  idPrograma={programa.idPrograma}>
                  <ListItemText
                    primary={programa.nombre}
                    secondary={programa.subtitulo ? programa.subtitulo : null}
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
          open={dialogoOpenInfoPrograma}
          onDialogoOpen={this.onDialogoOpenInfoPrograma}
          onDialogoClose={this.onDialogoCloseInfoPrograma}
          titulo={'Cursos del programa ' + dialogTituloPrograma}
          botonera={
            <div className={classes.containerBotonera}>
              <Divider />
              <div className={classes.botonesBotonera}>
                <Button variant="outlined" color="primary" className={classes.button} onClick={this.onDialogoCloseInfoPrograma}>Otro Curso</Button>
                <Button variant="contained" className={classes.buttonSiSi} onClick={this.procesarPreInscripcion}>{textoBotonDialog || 'PRE - INSCRIBIRME'}</Button>
              </div>
            </div>
          }
        >
          {dialogInformacionPrograma}
        </MiControledDialog>


        <MiControledDialog
          open={dialogoOpenInfoPreInscripcion}
          onDialogoOpen={this.onDialogoOpenInfoPreInscripcion}
          onDialogoClose={this.onDialogoCloseInfoPreInscripcion}
          classContainterContent={classes.contenedorInfoPreInscripcion}
        >
          <Icon className={classes.iconoOKPreInscripcion}>check_circle_outline</Icon>
          <Typography variant={'title'} style={{ fontSize: '30px' }}>
            Tu preinscripción {programaPreinscripto} fue realizada con éxito
          </Typography>
          <br />
          <Typography variant="subheading">
            Te enviamos un mail a {loggedUser.datos.email} con el comprobante del registro
          </Typography>
          <br /><br />
          {enfilaDeEspera &&
            <React.Fragment>
              <Typography variant="subheading">El programa al cual te preinscribiste ya tiene el cupo completo. Si lo deseas te podemos anotar en una lista de espera.</Typography><br /> <br />
              <Button variant="outlined" color="primary" className={classes.button} onClick={this.onDialogoEliminarPreInscripcion}>Elegir otro Curso</Button>
              <Button variant="contained" className={classes.buttonSiSi} >{'Anotarme en la lista de espera'}</Button></React.Fragment>
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

let componente = SeleccionPrograma;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
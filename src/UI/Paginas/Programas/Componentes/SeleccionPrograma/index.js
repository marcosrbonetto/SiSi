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
import { isNumber } from "util";

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

    this.state = {
      dialogoOpen: false,
      dialogoOpenInfoPrograma: false,
      dialogTituloPrograma: null,
      dialogInformacionPrograma: null,
      dialogoOpenInfoPreInscripcion: false,
      inputBuscador: '',
      programas: [
        {
          idPrograma: 1,
          titulo: 'Programa 1',
          subtitulo: 'este es el programa 1',
          informacion: <p>
            <b>¿Qué aprenderás?</b><br/>
            Se brindarán conocimientos para iniciarte en la lectura y escritura del idioma inglés.<br/><br/>
            <b>¿Qué podrás hacer?</b><br/>
            Obtendrás conocimientos básicos para leer, escribir y comunicarte en idioma inglés
          </p>
        },
        {
          idPrograma: 2,
          titulo: 'Programa 2',
          informacion: <p>Informacion del Programa 2</p>
        },
        {
          idPrograma: 3,
          titulo: 'Programa 3',
          subtitulo: 'este es el programa 3',
          informacion: <p>Informacion del programa 3</p>
        },
        {
          idPrograma: 4,
          titulo: 'Programa 4',
          informacion: <p>Informacion del Programa 4</p>
        }
      ],
      listaProgramas: [
        {
          idPrograma: 1,
          titulo: 'Programa 1',
          subtitulo: 'este es el programa 1',
          informacion: <p>Informacion del programa 1</p>
        },
        {
          idPrograma: 2,
          titulo: 'Programa 2',
          informacion: <p>Informacion del Programa 2</p>
        },
        {
          idPrograma: 3,
          titulo: 'Programa 3',
          subtitulo: 'este es el programa 3',
          informacion: <p>Informacion del programa 3</p>
        },
        {
          idPrograma: 4,
          titulo: 'Programa 4',
          informacion: <p>Informacion del Programa 4</p>
        }
      ]
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
      return _.filter(stateArrayProgramas, (item) => { return item.titulo.indexOf(inputValue) != -1 });
  }

  onClickPrograma = (event) => {
    var idPrograma = event.currentTarget.attributes.idPrograma.value;
    idPrograma = !isNaN(idPrograma) ? parseInt(idPrograma) : idPrograma;
    var programas = this.state.programas;

    var programaSeleccionado = _.find(programas, { idPrograma: idPrograma });

    if (programaSeleccionado) {
      this.setState({
        dialogoOpenInfoPrograma: true,
        dialogTituloPrograma: programaSeleccionado.titulo,
        dialogInformacionPrograma: programaSeleccionado.informacion,
      });
    }
  }

  procesarPreInscripcion = () => {
    this.onDialogoCloseInfoPrograma();
    this.onDialogoOpenInfoPreInscripcion();
  }

  render() {
    const {
      classes,
      tituloPrograma,
      textoBoton,
      textoBotonDialog,
      textoInformativo,
      classTituloPrograma,
      classTextoInformativo
    } = this.props;

    const {
      dialogoOpen,
      listaProgramas,
      inputBuscador,
      dialogoOpenInfoPrograma,
      dialogTituloPrograma,
      dialogInformacionPrograma,
      dialogoOpenInfoPreInscripcion
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
                    primary={programa.titulo}
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
          <Typography variant={'title'} style={{fontSize: '30px'}}>
            Tu preinscripción a Administración - Ingles - Nivel Básico fue realizada con éxito
          </Typography>
          <br/>
          <Typography variant="subheading">
          Te enviamos un mail a adridotta@gmail.com con el comprobante del registro
          </Typography>
          <br/><br/>
          <Typography variant="subheading">
          El programa al cual te preinscribiste ya tiene el cupo completo. Si lo deseas te podemos anotar en una lista de espera.
          </Typography>
          <br/><br/>
          <Button variant="outlined" color="primary" className={classes.button} onClick={this.onDialogoCloseInfoPreInscripcion}>Elegir otro Curso</Button>
          <Button variant="contained" className={classes.buttonSiSi} >{'Anotarme en la lista de espera'}</Button>
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
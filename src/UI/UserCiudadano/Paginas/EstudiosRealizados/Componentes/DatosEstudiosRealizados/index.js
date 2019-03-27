import React from "react";
import { withRouter } from "react-router-dom";

import _ from "lodash";
import { push } from "connected-react-router";

//Styles
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import classNames from "classnames";

//Redux
import { mostrarCargando } from '@Redux/Actions/mainContent';
import { actualizarEstudiosRealizados } from '@Redux/Actions/usuario';
import { mostrarAlerta, mostrarMensaje, stringToDate, dateToString } from "@Utils/functions";

//Material UI
import Icon from '@material-ui/core/Icon';
import Button from "@material-ui/core/Button";
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';

//Mis Componentes
import MiCard from "@Componentes/MiNewCard";
import MiInput from "@Componentes/MiInput";

import CardEstudiosRealizados from '@ComponentesEstudiosRealizados/CardEstudiosRealizados'
import FormEstudiosRealizados from '@ComponentesEstudiosRealizados/FormEstudiosRealizados'

import Rules_EstudiosRealizados from "@Rules/Rules_EstudiosRealizados";

import { arrayTipoEstudios } from '@DatosEstaticos/EstudiosRealizados'

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
  actualizarEstudiosRealizados: (data) => {
    dispatch(actualizarEstudiosRealizados(data));
  },
  redireccionar: url => {
    dispatch(push(url));
  },
});

class DatosEstudiosRealizados extends React.PureComponent {
  constructor(props) {
    super(props);

    let listaEstudiosRealizados = props.loggedUser.datos.estudios;

    this.state = {
      listaEstudiosRealizados: listaEstudiosRealizados && listaEstudiosRealizados.length > 0 && listaEstudiosRealizados || [],
      itemToEdit: null
    };
  }

  componentWillMount() {

  }

  modificarEstudiosRealizados = (EstudiosRealizadosModificada) => {
    if (!EstudiosRealizadosModificada) return false;

    let listaEstudiosRealizados = _.cloneDeep(this.state.listaEstudiosRealizados);

    _.remove(listaEstudiosRealizados, function (item) {
      return item.id == EstudiosRealizadosModificada.id;
    });

    this.setState({
      listaEstudiosRealizados: [...listaEstudiosRealizados, EstudiosRealizadosModificada]
    }, () => {
      console.log(this.state.listaEstudiosRealizados);
      this.guardarEstudiosRealizados();
    });
  }

  agregarEstudiosRealizados = (EstudiosRealizadosAgregada) => {
    if (!EstudiosRealizadosAgregada) return false;

    //Agregamos ID
    const randomId = (new Date()).getTime() + parseInt(1 + Math.random() * (10 - 1));
    EstudiosRealizadosAgregada.id = randomId;

    this.setState({
      listaEstudiosRealizados: [...this.state.listaEstudiosRealizados, EstudiosRealizadosAgregada]
    }, () => {
      console.log(this.state.listaEstudiosRealizados);
      this.guardarEstudiosRealizados();
    });
  }

  guardarEstudiosRealizados = () => {
    this.props.mostrarCargando(true);
    const token = this.props.loggedUser.token;
    const estudiosRealizados = this.state.listaEstudiosRealizados;

    Rules_EstudiosRealizados.insertEstudiosRealizados(token, estudiosRealizados)
      .then((datos) => {
        this.props.mostrarCargando(false);
        if (!datos.ok) {
          mostrarAlerta('Ocurrió un error al intentar guardar los estudios realizados');
          return false;
        }

        this.props.actualizarEstudiosRealizados(estudiosRealizados);
        mostrarMensaje('Estudios realizados guardados exitosamente!');
      })
      .catch((error) => {
        mostrarAlerta('Ocurrió un error al intentar guardar los estudios realizados');
        console.error('Error Servicio "Rules_EstudiosRealizados.insertEstudiosRealizados": ' + error);
      });
  }

  eliminarEstudiosRealizados = (idEstRea) => {
    const newArrayEstRea = _.filter(this.state.listaEstudiosRealizados, (estRea) => {
      return estRea.id != idEstRea;
    });

    this.setState({
      listaEstudiosRealizados: newArrayEstRea
    }, () => {
      console.log(this.state.listaEstudiosRealizados);
      this.guardarEstudiosRealizados();
    });
  }

  volverInicio = () => {
    this.props.redireccionar("/Inicio");
  }

  editarEstudiosRealizados = (itemToEdit) => {
    this.setState({
      itemToEdit: itemToEdit
    });
  }

  handleOnCloseDialog = () => {
    this.setState({
      itemToEdit: null
    });
  }

  render() {
    const { classes } = this.props;
    let { listaEstudiosRealizados, itemToEdit } = this.state;

    let gruposNiveles = _.groupBy(listaEstudiosRealizados, (o) => { return o.tipoEstudio });
    
    return (
      <React.Fragment>
        <MiCard
          informacionAlerta={'Cargá acá tus estudios realizados, desde el secundario hasta el nivel que haya alzcanzado'}
          seccionBotones={{
            align: 'space-between',
            content: <React.Fragment>
              <Button onClick={this.volverInicio} variant="outlined" color="primary" className={classes.button}>
                <Icon className={classNames(classes.iconoBotonAtras, classes.secondaryColor)}>arrow_back_ios</Icon>
                Volver</Button>

              <FormEstudiosRealizados
                handleEstudiosRealizadosAgregada={this.agregarEstudiosRealizados}
                handleEstudiosRealizadosModificada={this.modificarEstudiosRealizados}
                itemToEdit={itemToEdit}
                handleOnCloseDialog={this.handleOnCloseDialog}
              />
            </React.Fragment>
          }}
        >

          {listaEstudiosRealizados.length == 0 && <MiInput
            tipoInput={'checkbox'}
            label={'No tengo ningún estudio realizado'}
            checked={true}
          />}

          <div className={classes.itemsContainer}>
            <List className={classes.root}>
              {Object.keys(gruposNiveles).reverse().map((value) => {
                
                var idTipoEstudio = parseInt(value);

                if (_.filter(gruposNiveles[idTipoEstudio], { tipoEstudio: idTipoEstudio }).length > 0) {

                  var lista = _.orderBy(gruposNiveles[idTipoEstudio], ['fechaFinalizacion', 'fechaInicio'], ['desc', 'desc']);
                  var tipoEstudio = _.find(arrayTipoEstudios, { value: idTipoEstudio });

                  return <React.Fragment>
                    <Typography variant="headline" style={{marginTop: '10px'}}>
                      <b>{tipoEstudio.label}</b>
                    </Typography>
                    <hr />
                    {lista.map((cardData, index) => {
                        return <React.Fragment>
                          
                          <CardEstudiosRealizados
                            cardData={cardData}
                            handleEliminarEstudiosRealizados={this.eliminarEstudiosRealizados}
                            handleEditarEstudiosRealizados={this.editarEstudiosRealizados}
                          />
                          
                        </React.Fragment>;
                    })}
                  </React.Fragment>;

                }

              })}
            </List>
          </div>

        </MiCard>
      </React.Fragment>
    );
  }
}

const styles = theme => ({
  bottomContent: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  textoLink: {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
    marginLeft: '20px',
  },
  iconoBotonAtras: {
    fontSize: '16px',
  },
  iconoBoton: {
    fontSize: '20px',
  },
});

let componente = DatosEstudiosRealizados;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
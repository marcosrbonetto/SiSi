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
import Grid from "@material-ui/core/Grid";

//Mis Componentes
import MiCard from "@Componentes/MiNewCard";
import MiInput from "@Componentes/MiInput";

import CardEstudiosRealizados from '@ComponentesEstudiosRealizados/CardEstudiosRealizados'
import FormEstudiosRealizados from '@ComponentesEstudiosRealizados/FormEstudiosRealizados'

import Rules_EstudiosRealizados from "@Rules/Rules_EstudiosRealizados";

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
      listaEstudiosRealizados: listaEstudiosRealizados && listaEstudiosRealizados.length > 0 && listaEstudiosRealizados || []
    };
  }

  componentWillMount() {

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
    });
  }

  volverInicio = () => {
    this.props.redireccionar("/Inicio");
  }

  render() {
    const { classes } = this.props;
    const { listaEstudiosRealizados } = this.state;

    return (
      <React.Fragment>
        <MiCard
          informacionAlerta={'Cargá acá tus estudios realizados, desde el secundario hasta el nivel que haya alzcanzado'}
          seccionBotones={{
            align: 'right',
            content: <React.Fragment>
            <Button onClick={this.volverInicio} variant="outlined" color="primary" className={classes.button}>
              <Icon className={classNames(classes.iconoBoton, classes.secondaryColor)}>arrow_back_ios</Icon>
              Atrás</Button> 
              <Button onClick={this.guardarEstudiosRealizados} variant="outlined" color="primary" className={classes.button}>
              <Icon className={classNames(classes.iconoBoton, classes.secondaryColor)}>create</Icon>
              Guardar</Button>
            </React.Fragment>
          }}
        >

          {listaEstudiosRealizados.length == 0 && <MiInput
            tipoInput={'checkbox'}
            label={'No tengo ningún estudio realizado'}
            checked={true}
          />}

          <FormEstudiosRealizados
            handleEstudiosRealizadosAgregada={this.agregarEstudiosRealizados}
          />

          <div className={classes.itemsContainer}>
            {listaEstudiosRealizados.map((cardData) => {
              return <CardEstudiosRealizados
                cardData={cardData}
                handleEliminarEstudiosRealizados={this.eliminarEstudiosRealizados}
              />
            })}
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
  iconoBoton: {
    fontSize: '16px',
  },
});

let componente = DatosEstudiosRealizados;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
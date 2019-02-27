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
import Icon from '@material-ui/core/Icon';
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

//Mis Componentes
import MiCard from "@Componentes/MiNewCard";
import MiInput from "@Componentes/MiInput";

import CardEstudiosRealizados from '@ComponentesEstudiosRealizados/CardEstudiosRealizados'
import FormEstudiosRealizados from '@ComponentesEstudiosRealizados/FormEstudiosRealizados'

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

class DatosEstudiosRealizados extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      listaEstudiosRealizados: []
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

  eliminarEstudiosRealizados = (idEstRea) => {
    const newArrayEstRea = _.filter(this.state.listaEstudiosRealizados, (estRea) => {
      return estRea.id != idEstRea;
    });

    this.setState({
      listaEstudiosRealizados: newArrayEstRea
    });
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
            content: <Button variant="outlined" color="primary" className={classes.button}>
              <Icon className={classNames(classes.iconoBoton, classes.secondaryColor)}>create</Icon>
              Guardar</Button>
          }}
        >

          <MiInput
            tipoInput={'checkbox'}
            label={'No tengo ningún estudio realizado'}
            checked={true}
          />

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
  }
});

let componente = DatosEstudiosRealizados;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
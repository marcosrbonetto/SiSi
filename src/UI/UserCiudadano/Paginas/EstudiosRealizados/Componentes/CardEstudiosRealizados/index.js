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
import Typography from '@material-ui/core/Typography';

//Mis Componentes
import MiCard from "@Componentes/MiCard";

import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

import { dateToString } from "@Utils/functions";

import {arrayTipoEstudios, arrayMedidaDeTiempo} from '@DatosEstaticos/EstudiosRealizados'

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

class CardEstudiosRealizados extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentWillMount() {

  }

  handleEliminarEstudiosRealizados = (event) => {
    const idEstRea = event && event.currentTarget.attributes.idEstRea.value || 0;

    this.props.handleEliminarEstudiosRealizados && this.props.handleEliminarEstudiosRealizados(idEstRea);
  }

  render() {
    const { classes, cardData } = this.props;

    var tipoEstudio = _.find(arrayTipoEstudios, { value: cardData.tipoEstudio });
    var medidaDeTiempo = _.find(arrayMedidaDeTiempo, { value: cardData.medidaDeTiempo });

    return (
      <React.Fragment>
        <MiCard className={classes.container}>
            <Typography variant="headline">
              {cardData.nombre || '-'}
              <Button onClick={this.handleEliminarEstudiosRealizados} idEstRea={cardData.id || 0} size="small" color="secondary" aria-label="Add" className={classes.iconoEliminar}>
                <DeleteIcon />
              </Button>
            </Typography>
            <Typography component="p">
              <b>Tipo:</b> {tipoEstudio && tipoEstudio.label || '-'}<br />
              <b>Descripción:</b> {cardData.descripcion || '-'}<br />
              <b>Lugar de Cursado:</b> {cardData.lugarDeCursado || '-'}<br />
              <b>Duración:</b> {cardData.duracion || '-'} {medidaDeTiempo && medidaDeTiempo.label || '-'}<br />
              <b>Desde:</b> {cardData.fechaInicio ? cardData.fechaInicio : '-'}<br />
              <b>Hasta:</b> {cardData.fechaFinalizacion ? cardData.fechaFinalizacion : '-'}<br />
              <b>Url Certificado</b> <a href={cardData.urlCertificado || '#'} target="_blank">Link</a><br />
            </Typography>
        </MiCard>
      </React.Fragment>
    );
  }
}

const styles = theme => ({
  container: {
    display: 'inline-block',
    margin: '10px',
    minWidth: '220px'
  },
  iconoEliminar: {
    top: '-4px',
    right: '-5px',
    background: '#cacaca',
    boxShadow: 'none',
    minWidth: '10px',
    float: 'right',
    borderRadius: '30px',
    '&:hover': {
      background: '#929090'
    }
  }
});

let componente = CardEstudiosRealizados;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
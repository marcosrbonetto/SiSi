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
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import { dateToString } from "@Utils/functions";

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

  handleEditarEstudiosRealizados = () => {

  }

  render() {
    const { classes, cardData } = this.props;

    var tipoEstudio = _.find(arrayTipoEstudios, { value: cardData.tipoEstudio });

    return (
      <React.Fragment>
        <ListItem>

          <ListItemText
            primary={<Typography variant="headline">{cardData.nombre}</Typography>}
            secondary={
              <React.Fragment>
                <Grid container>
                  <Grid item xs={12} sm={12}>
                    <Typography component="p">
                      <b>Descripción:</b> {cardData.descripcion || '-'}<br />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography component="p">
                      <b>Tipo:</b> {tipoEstudio && tipoEstudio.label || '-'}<br />
                      <b>Lugar de Cursado:</b> {cardData.lugarDeCursado || '-'}<br />
                      <b>Duración:</b> {cardData.duracion || '-'}<br />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography component="p">
                      <b>Desde:</b> {cardData.fechaInicio ? cardData.fechaInicio : '-'}<br />
                      <b>Hasta:</b> {cardData.fechaFinalizacion ? cardData.fechaFinalizacion : '-'}<br />
                    </Typography>
                  </Grid>
                </Grid>
                <Button title="Editar" onClick={this.handleEditarEstudiosRealizados} idEstRea={cardData.id || 0} size="small" color="secondary" aria-label="Add" className={classes.iconoEditar}>
                  <EditIcon />
                </Button>
                <Button title="Eliminar" onClick={this.handleEliminarEstudiosRealizados} idEstRea={cardData.id || 0} size="small" color="secondary" aria-label="Add" className={classes.iconoEliminar}>
                  <DeleteIcon />
                </Button>
              </React.Fragment>
            }
          />

        </ListItem>

      </React.Fragment>
    );
  }
}

const styles = theme => ({
  iconoEditar: {
    top: '14px',
    right: '56px',
    position: 'absolute',
    background: '#cacaca',
    boxShadow: 'none',
    minWidth: '10px',
    borderRadius: '30px',
    '&:hover': {
      background: '#929090'
    }
  },
  iconoEliminar: {
    top: '14px',
    right: '12px',
    position: 'absolute',
    background: '#cacaca',
    boxShadow: 'none',
    minWidth: '10px',
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
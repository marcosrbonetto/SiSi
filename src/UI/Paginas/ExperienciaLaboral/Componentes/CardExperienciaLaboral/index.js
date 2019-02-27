import React from "react";
import { withRouter } from "react-router-dom";

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

class CardExperienciaLaboral extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentWillMount() {

  }

  handleEliminarExperienciaLaboral = (event) => {
    const idExpLab = event && event.currentTarget.attributes.idExpLab.value || 0;

    this.props.handleEliminarExperienciaLaboral && this.props.handleEliminarExperienciaLaboral(idExpLab);
  }

  render() {
    const { classes, cardData } = this.props;

    return (
      <React.Fragment>
        <MiCard className={classes.container}>
            <Typography variant="headline">
              {cardData.nombre || '-'}
              <Button onClick={this.handleEliminarExperienciaLaboral} idExpLab={cardData.id || 0} size="small" color="secondary" aria-label="Add" className={classes.iconoEliminar}>
                <DeleteIcon />
              </Button>
            </Typography>
            <Typography component="p">
              <b>Descripción:</b> {cardData.descripcion || '-'}<br />
              <b>Contacto:</b> {cardData.contacto || '-'}<br />
              <b>CUIT:</b> {cardData.cuit || '-'}<br />
              <b>Desde:</b> {cardData.fechaInicio ? cardData.fechaInicio : '-'}<br />
              <b>Hasta:</b> {cardData.fechaFinalizacion ? cardData.fechaFinalizacion : '-'}
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

let componente = CardExperienciaLaboral;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
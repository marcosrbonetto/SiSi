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
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

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

  handleEditarExperienciaLaboral = (event) => {
    this.props.handleEditarExperienciaLaboral && this.props.handleEditarExperienciaLaboral(this.props.cardData);
  }
  
  render() {
    const { classes, cardData } = this.props;

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
                      <b>Contacto:</b> {cardData.contacto || '-'}<br />
                      <b>CUIT:</b> {cardData.cuit || '-'}<br />
                      <b>Cargo/Actividad:</b> {cardData.cargo || '-'}<br />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography component="p">
                      <b>Desde:</b> {cardData.fechaInicio ? cardData.fechaInicio : '-'}<br />
                      <b>Hasta:</b> {cardData.fechaFinalizacion ? cardData.fechaFinalizacion : '-'}
                    </Typography>
                  </Grid>
                </Grid>
                <Button title="Editar" onClick={this.handleEditarExperienciaLaboral} idEstRea={cardData.id || 0} size="small" color="secondary" aria-label="Add" className={classes.iconoEditar}>
                  <EditIcon />
                </Button>
                <Button title="Eliminar" onClick={this.handleEliminarExperienciaLaboral} idExpLab={cardData.id || 0} size="small" color="secondary" aria-label="Add" className={classes.iconoEliminar}>
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

let componente = CardExperienciaLaboral;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
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

  render() {
    const { classes } = this.props;
    const { dialogoOpen } = this.state;

    return (
      <React.Fragment>
        <MiCard className={classes.container}>
            <Typography variant="headline">
              NETBEL S.A.
              <Button size="small" color="secondary" aria-label="Add" className={classes.iconoEliminar}>
                <DeleteIcon />
              </Button>
            </Typography>
            <Typography component="p">
              <b>Descripción:</b> asd<br />
              <b>Contacto:</b> asd<br />
              <b>CUIT:</b> asd<br />
              <b>Desde:</b> 01/02/2019<br />
              <b>Hasta:</b> 28/02/2019
            </Typography>
        </MiCard>
      </React.Fragment>
    );
  }
}

const styles = theme => ({
  container: {
    display: 'inline-block',
    margin: '10px'
  },
  iconoEliminar: {
    top: '-4px',
    right: '-5px',
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
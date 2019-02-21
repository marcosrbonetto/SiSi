import React from "react";
import { withRouter } from "react-router-dom";

//Styles
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import classNames from "classnames";

//Redux
import { mostrarCargando } from '@Redux/Actions/mainContent'

//Material UI
import Icon from '@material-ui/core/Icon';
import Button from "@material-ui/core/Button";

//Mis Componentes
import MiCard from "@Componentes/MiNewCard";
import MiInput from "@Componentes/MiInput";

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

class Notificaciones extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentWillMount() {

  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <MiCard
          titulo={'Notificaciones'}
          informacionAlerta={'Para poder comunicarnos con vos, necesitamos que aceptes recibir notificaciones a través de los datos de contacto que completaste en el punto anterior'}
          seccionBotones={{
            align: 'right',
            content: <Button variant="outlined" color="primary" className={classes.button}>
            <Icon className={classNames(classes.iconoBoton, classes.secondaryColor)}>create</Icon>
            Modificar</Button>
          }}
        >

          <MiInput
            tipoInput={'checkbox'}
            label={'Deseo recibir notificaciones a mi e-mail, telefono y/o redes sociales'}
            checked={true}
          />

        </MiCard>
      </React.Fragment>
    );
  }
}

const styles = theme => ({
  bottomContent: {
    display: 'flex',
    alignItems: 'flex-end',
  }
});

let componente = Notificaciones;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
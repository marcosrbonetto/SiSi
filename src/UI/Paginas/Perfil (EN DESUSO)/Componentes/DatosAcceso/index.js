import React from "react";
import { withRouter } from "react-router-dom";

//Styles
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import classNames from "classnames";

//Redux
import { mostrarCargando } from '@Redux/Actions/mainContent'

//Mis Componentes
import MiCard from "@Componentes/MiNewCard";
import MiDatoPerfil from "@Componentes/MiDatoPerfil";

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

class DatosAcceso extends React.PureComponent {
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
          titulo={'Datos de acceso'}
        >

          <MiDatoPerfil
            icono={'person'}
            texto={'Nombre de Usuario'}
            subtexto={'dotta_a'}
          />
          <br />
          <MiDatoPerfil
            icono={'vpn_key'}
            texto={'Contraseña'}
            subtexto={'••••••••••••'}
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

let componente = DatosAcceso;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
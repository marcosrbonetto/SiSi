import React from "react";
import { withRouter } from "react-router-dom";
import CordobaFilesUtils from "@Utils/CordobaFiles";

//Styles
import styles from './styles'
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import classNames from "classnames";

//Redux
import { mostrarCargando } from '@Redux/Actions/mainContent'

//Material UI 
import Grid from '@material-ui/core/Grid';
import Avatar from "@material-ui/core/Avatar";

import DatosAcceso from '@ComponentesPerfil/DatosAcceso'
import DatosAdicionales from '@ComponentesPerfil/DatosAdicionales'
import DatosContacto from '@ComponentesPerfil/DatosContacto'
import DatosPersonales from '@ComponentesPerfil/DatosPersonales'
import DomicilioParticular from '@ComponentesPerfil/DomicilioParticular'
import Notificaciones from '@ComponentesPerfil/Notificaciones'

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

class Perfil extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentWillMount() {

  }

  render() {
    const { classes } = this.props;

    const datosUsuario = this.props.loggedUser.datos;
    let urlFotoPerfil;
    if (datosUsuario) {
      urlFotoPerfil = CordobaFilesUtils.getUrlFotoMediana(datosUsuario.identificadorFotoPersonal, datosUsuario.sexoMasculino);
      urlFotoPerfil = urlFotoPerfil.slice(0, -2);
    }

    return (
      <div className={classes.mainContainer}>
        <Grid container spacing={16} justify="center">
          <Grid item xs={12} sm={6}>
            <div className={classes.centerContainer}>
              <Avatar alt="Menu del usuario" src={urlFotoPerfil} className={classNames(classes.icono)} /><br /><br />
            </div>

            <DatosPersonales />
            
            <br /><br />
            
            <DatosAcceso />
            
            <br /><br />
            
            <DomicilioParticular />

            <br /><br />
            
            <DatosAdicionales />

            <br /><br />

            <DatosContacto />

            <br/><br/>

            <Notificaciones />

          </Grid>
        </Grid>
      </div>
    );
  }
}

let componente = Perfil;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
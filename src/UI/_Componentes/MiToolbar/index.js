import React from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import { push } from "connected-react-router";

//Componentes
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Avatar from "@material-ui/core/Avatar";
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Popover from "@material-ui/core/Popover";

import MiNotificacion from "@Componentes/MiNotificacion";
import MiCard from "@Componentes/MiCard";
import MiMenuApps from "@Componentes/MiMenuApps";

//REDUX
import { connect } from "react-redux";
import { logout } from "@Redux/Actions/usuario";
import Icon from '@material-ui/core/Icon';

//Mis componentes
import CordobaFilesUtils from "@Utils/CordobaFiles";
import { getTextoTipoTributo } from "@Utils/functions"

const mapStateToProps = state => {
  return {
    usuario: state.Usuario.usuario,
    loggedUser: state.Usuario.loggedUser,
    paraMobile: state.MainContent.paraMobile,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => {
      dispatch(logout());
    },
    redireccionar: url => {
      dispatch(push(url));
    },
  };
};

class MiToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorPopupUsuario: undefined,
      datosUsuario: this.props.loggedUser && this.props.loggedUser.datos || undefined,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.loggedUser.datos) != JSON.stringify(nextProps.loggedUser.datos)) {
      this.setState({
        datosUsuario: nextProps.loggedUser.datos
      });
    } else {
      this.setState({
        datosUsuario: this.props.loggedUser.datos
      });
    }
  }

  onUsuarioPress = event => {
    if (this.props.cargando) return;
    this.setState({ anchorPopupUsuario: event.currentTarget });
  };

  onUsuarioMenuClose = () => {
    if (this.props.cargando) return;
    this.setState({ anchorPopupUsuario: null });
  };

  onBotonCerrarSesionPress = () => {
    if (this.props.cargando) return;
    this.setState({ anchorPopupUsuario: null });
    this.props.logout();
  };

  handleDrawerClose = () => {
    if (this.props.cargando) return;
    this.props.onClose();
  };

  handleDrawerOpen = () => {
    if (this.props.cargando) return;

    if (this.props.open) {
      this.props.onClose();
    } else {
      this.props.onOpen();
    }
  };

  handleClickLogo = () => {
    this.props.redireccionar('/Inicio');
  }

  onMiPerfilClick = () => {
    this.setState({ anchorPopupUsuario: null });
    window.location.href = window.Config.URL_MI_PERFIL + "/#/?token=" + this.props.loggedUser.token;
  };

  handleInicioSesion = () => {
    this.setState({ anchorPopupUsuario: null });
    window.location.href = window.Config.URL_LOGIN;
  };

  handleBienesPorCUIT = () => {
    window.location.href = window.Config.BASE_URL_AFIP + "/afipInicio.html?urlRedirect=" + encodeURIComponent(window.Config.BASE_URL_SET_AFIP + '/importacionBienesCuitAFIP?appUrlRedirect=' + window.location.hash.substring(1));
  };

  handleBienesPorCUITRepresentantes = () => {
    window.location.href = window.Config.BASE_URL_AFIP + "/afipInicio.html?urlRedirect=" + encodeURIComponent(window.Config.BASE_URL_SET_AFIP + '/importacionMasivaAFIP?appUrlRedirect=' + window.location.hash.substring(1));
  };

  render() {
    let { classes, titulo } = this.props;

    let urlFotoPerfilMiniatura, urlFotoPerfil;
    if (this.state.datosUsuario) {
      urlFotoPerfilMiniatura = CordobaFilesUtils.getUrlFotoMiniatura(this.state.datosUsuario.identificadorFotoPersonal, this.state.datosUsuario.sexoMasculino);
      urlFotoPerfil = CordobaFilesUtils.getUrlFotoMediana(this.state.datosUsuario.identificadorFotoPersonal, this.state.datosUsuario.sexoMasculino);
    }

    titulo = getTextoTipoTributo(titulo);

    return (
      <AppBar color="secondary" position="absolute" className={classNames(classes.appBar)}>
        <Toolbar disableGutters={true} className={classes.toolbar}>
          {this.props.renderLeftIcon != undefined &&
            this.props.renderLeftIcon()}

          {this.props.renderLeftIcon == undefined &&
            this.props.leftIcon != undefined && (
              <div className={classes.menuButton}>
                <IconButton
                  color="inherit"
                  aria-label={this.props.leftIconHint || "Boton del toolbar"}
                  onClick={this.props.leftIconClick}
                >
                  <Icon>{this.props.leftIcon}</Icon>
                </IconButton>
              </div>
            )}

          {/* Logo muni */}
          {<div onClick={this.handleClickLogo} className={classNames("imgMuni", classes.logoMuni)}></div>}


          <Typography
            variant="title"
            color="inherit"
            noWrap
            className={classNames(classes.title, "tituloTooltip")}
          >
            {titulo}
          </Typography>

          {/* Icono de Notificaciones */}
          {/* Icono del usuario */}
          {this.state.datosUsuario && <div className={classes.loggedIcons}>
            <MiNotificacion />

            <IconButton onClick={this.onUsuarioPress} color="inherit">
              <Avatar alt="Menu del usuario" src={urlFotoPerfilMiniatura} className={classNames(classes.icono)} />
            </IconButton>
          </div>}


          {/* Inicio sesion Vecino Virtual */}
          {/*!this.state.datosUsuario && <div>
            <Button onClick={this.handleInicioSesion} variant="contained" color="primary">
              Iniciar Sesión
            </Button>
          </div>*/}

          <MiMenuApps />

        </Toolbar>

        {this.state.datosUsuario && <Menu
          id="simple-menu"
          anchorEl={this.state.anchorPopupUsuario}
          getContentAnchorEl={null}
          className={classes.menuUsuario}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={Boolean(this.state.anchorPopupUsuario)}
          onClose={this.onUsuarioMenuClose}
        >
          <div className={classes.menuUsuarioInfo} style={{ display: "flex" }}>
            <Avatar alt="Menu del usuario" src={urlFotoPerfil} className={classNames(classes.icono)} />
            <Typography align="center" variant="subheading" color="inherit">
              {this.state.datosUsuario &&
                this.state.datosUsuario.apellido + ', ' + this.state.datosUsuario.nombre}
            </Typography>
          </div>

          <MenuItem divider onClick={this.onMiPerfilClick}>
            Mi perfil
            </MenuItem>
          <MenuItem onClick={this.onBotonCerrarSesionPress}>
            Cerrar sesión
          </MenuItem>
        </Menu>}

        <div
          className={classNames(
            classes.contenedorCargando,
            this.props.cargando == true && classes.contenedorCargandoVisible
          )}
        >
          <LinearProgress color="primary" />
        </div>

      </AppBar>
    );
  }
}

const styles = theme => {
  return {
    toolbar: {
      paddingRight: 24 // keep right padding when drawer closed
    },
    toolbarIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 8px",
      ...theme.mixins.toolbar
    },
    menuButton: {
      marginLeft: 6,
      marginRight: 6
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 2
    },
    logoMuni: {
      cursor: 'pointer'
    },
    title: {
      borderLeft: '1px solid rgba(0,0,0,0.2)',
      padding: '10px 0px 10px 20px',
      flexGrow: 1
    },
    icono: {
      width: 40,
      height: 40,
      borderRadius: 40,
      backgroundColor: "white"
    },
    menuUsuario: {
      "& div:nth-child(2)": {
        width: "20rem",
        minWidth: "20rem",
        maxWidth: "20rem"
      },
      "& ul": {
        paddingTop: 0
      }
    },
    menuUsuarioInfo: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.unit * 2,
      "& h2": {
        marginLeft: theme.spacing.unit
      },
      "& > div": {
        width: "5rem",
        height: "5rem",
        marginBottom: "0.5rem"
      },
      "&:focus": {
        outline: "none"
      },
      backgroundColor: "rgba(0,0,0,0.025)",
      borderBottom: "1px solid rgba(0, 0, 0, 0.095);"
    },
    contenedorCargando: {
      position: "absolute",
      bottom: 0,
      width: "100%",
      opacity: 0,
      transition: "all 0.3s"
    },
    contenedorCargandoVisible: {
      opacity: 1
    },
    btnBienesPorCUIT: {
      marginRight: '10px',
      marginTop: '5px',
      marginBottom: '5px',
    },
    loggedIcons: {
      textAlign: 'right',
      minWidth: '100px',
      right: '20px',
      '& > *': {
        display: 'inline-block'
      }
    },
    contentPopover: {
      borderRadius: '10px'
    },
    styleMiCard: {
      borderRadius: '10px',
      padding: '10px',
      width: '264px'
    },
    bigAvatar: {
      margin: 10,
      width: 60,
      height: 60,
      display: 'inline-block',
      cursor: 'pointer',
      '&:hover': {
        boxShadow: '0px 0px 16px 0px #149257'
      }
    },
  };
};

let componente = undefined;
componente = withStyles(styles)(MiToolbar);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
export default componente;
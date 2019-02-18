import React from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import _ from "lodash";

//Componentes
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Popover from "@material-ui/core/Popover";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import ListItemIcon from "@material-ui/core/ListItemIcon";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import ListItemText from "@material-ui/core/ListItemText";

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import MiCard from "@Componentes/MiCard";

import servicesNotificaciones from '@Rules/Rules_Notificaciones';

//REDUX
import { connect } from "react-redux";
import { mostrarCargando } from '@Redux/Actions/mainContent'
import { replace } from "connected-react-router";

const mapStateToProps = state => {
  return {
    loggedUser: state.Usuario.loggedUser,
  };
};

const mapDispatchToProps = dispatch => ({
  mostrarCargando: (cargar) => {
    dispatch(mostrarCargando(cargar));
  },
  redireccionar: url => {
    dispatch(replace(url));
  },
});

class MiNotificacion extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      openNotificacion: false,
      notificacion: {
        tituloNotificacion: '',
        textoNotificacion: ''
      },
      arrayCUITNotificaciones: [],
      cantTotalNotif: 0
    };
  }

  componentDidMount() {
    const token = this.props.loggedUser.token;

    servicesNotificaciones.getMisNotificaciones(token)
      .then((datos) => {
        if (!datos.ok) { return false; }

        let arrayNotificaciones = [];
        let cantTotalNotif = 0;
        const arrayCUITs = _.map(_.uniqBy(datos.return, 'cuil'), 'cuil');

        arrayCUITs.map((cuit) => {
          const cantidad = _.filter(datos.return, { 'cuil': cuit, leida: false }).length;

          arrayNotificaciones.push({
            cuit: cuit,
            arrayNotificaciones: _.filter(datos.return, { 'cuil': cuit }),
            cantNotif: cantidad,
          });

          cantTotalNotif += cantidad;
        });

        this.setState({
          arrayCUITNotificaciones: arrayNotificaciones,
          cantTotalNotif: cantTotalNotif
        })

      });
  }

  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget
    });
  }

  handleClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    });
  }

  handleToggleNotificacion = event => {
    this.setState({
      openNotificacion: !this.state.openNotificacion
    });
  }

  handleClickItemLista = event => {
    this.handleClick(event);

    const cuit = event.currentTarget.attributes.cuit ? event.currentTarget.attributes.cuit.value : null;
    const idNotificacion = event.currentTarget.attributes.idNotificacion.value;

    const datosCuit = _.find(this.state.arrayCUITNotificaciones, { 'cuit': cuit });
    const notificacion = _.find(datosCuit.arrayNotificaciones, { 'id': parseInt(idNotificacion) });

    const token = this.props.loggedUser.token;
    servicesNotificaciones.setNotificacionLeida(token, parseInt(idNotificacion))
      .then((datos) => {
        if (!datos.ok) { this.mostrarNotificacion(notificacion); return false; }

        notificacion.leida = true;
        datosCuit.cantNotif--;

        let cantTotalNotif = this.state.cantTotalNotif;
        this.setState({
          arrayCUITNotificaciones: this.state.arrayCUITNotificaciones,
          cantTotalNotif: cantTotalNotif - 1,
        });

        this.mostrarNotificacion(notificacion);

      });
  }

  mostrarNotificacion = (notificacion) => {
    if (notificacion.url) {
      this.props.redireccionar(notificacion.url);
    } else {
      this.setState({
        notificacion: {
          tituloNotificacion: notificacion.titulo,
          textoNotificacion: notificacion.contenido
        }
      });
      this.handleToggleNotificacion();
    }
  }


  render() {
    let { classes } = this.props;

    const { openNotificacion, anchorEl, expanded } = this.state;
    const openListado = Boolean(anchorEl);

    const cuilUserLog = this.props.loggedUser.datos.cuil;

    return (
      <div>
        {/* Icono de Notificaciones */}
        <IconButton
          className={classNames(classes.marginIcon, 'marginIcon')}
          color="inherit"
          onClick={this.handleClick}
        >
          {(this.state.cantTotalNotif > 0 && <Badge badgeContent={this.state.cantTotalNotif} color="secondary" >
            <NotificationsIcon />
          </Badge>)
            || <NotificationsIcon />}
        </IconButton>

        <Popover
          open={openListado}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          classes={{
            paper: classes.contentPopover
          }}>
          <MiCard padding={false} className={classes.styleMiCard}>

            {(this.state.arrayCUITNotificaciones.length == 0 &&
              <Typography className={classes.titleMiCard} variant="subheading">
                <b>No tiene Notificaciones</b>
                <i onClick={this.handleClose} className={classNames(classes.iconCloseNotif, "material-icons")}>cancel</i>
              </Typography>
            )
              ||
              <Typography className={classes.titleMiCard} variant="subheading">
                <b>Notificaciones</b>
                <i onClick={this.handleClose} className={classNames(classes.iconCloseNotif, "material-icons")}>cancel</i>
              </Typography>
            }

            {this.state.arrayCUITNotificaciones && this.state.arrayCUITNotificaciones.map((item, index) => {
              return <div>
                <Badge badgeContent={item.cantNotif} color="secondary" classes={{ badge: classes.badgeNotificaciones }}>
                  <ExpansionPanel expanded={expanded === 'panel' + index} onChange={this.handleChange('panel' + index)}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subheading">{item.cuit == null ? 'Generales' : (item.cuit == cuilUserLog ? 'Mis Notificaciones' : item.cuit)}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={classes.detalleNotificacion}>
                      <MenuList className={classes.listNotificacion}>
                        {item.arrayNotificaciones && item.arrayNotificaciones.map((notificacion, index) => {

                          return <MenuItem
                            key={index}
                            idNotificacion={notificacion.id}
                            cuit={notificacion.cuil}
                            onClick={this.handleClickItemLista}
                            className={!notificacion.leida && classes.notificacionNoLeida}>
                            <ListItemIcon>
                              <InboxIcon />
                            </ListItemIcon>
                            <ListItemText inset primary={notificacion.titulo} />
                          </MenuItem>;

                        })}
                      </MenuList>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </Badge> <br />
              </div>
            })}

          </MiCard>
        </Popover>


        <Dialog
          open={openNotificacion}
          onClose={this.handleToggleNotificacion}
          scroll='paper'
          aria-labelledby="scroll-dialog-title"
        >
          <DialogTitle id="scroll-dialog-title">{this.state.notificacion.tituloNotificacion}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {this.state.notificacion.textoNotificacion}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleToggleNotificacion} color="secondary">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const styles = theme => {
  return {
    toolbarIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 8px",
      ...theme.mixins.toolbar
    },
    title: {
      borderLeft: '1px solid rgba(0,0,0,0.2)',
      padding: '10px 0px 10px 20px',
      flexGrow: 1
    },
    styleMiCard: {
      borderRadius: '10px'
    },
    titleMiCard: {
      background: '#149257',
      color: '#fff',
      padding: '14px',
      margin: '0px',
      minWidth: '220px'
    },
    marginIcon: {
      margin: '0px 15px'
    },
    detalleNotificacion: {
      padding: '0px',
      width: '300px'
    },
    listNotificacion: {
      width: '100%'
    },
    badgeNotificaciones: {
      top: '12px',
      right: '46px',
    },
    contentPopover: {
      borderRadius: '10px'
    },
    notificacionNoLeida: {
      background: '#dedede'
    },
    iconCloseNotif: {
      right: '10px',
      position: 'absolute',
      cursor: 'pointer'
    }
  };
};

let componente = undefined;
componente = withStyles(styles)(MiNotificacion);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
export default componente;
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";

//Componentes
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";

//Mis componntes
import Menu from "../menu";
import DrawerItem from "./DrawerItem";

class MiDrawer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      itemMenuSeleccionado: this.props.paginaActual
    };
  }

  handleDrawerClose = () => {
    this.props.onClose();
  };

  handleDrawerOpen = () => {
    this.props.onOpen();
  };

  onDrawerItemClick = index => {
    if (this.props.onPaginaClick == undefined) return;

    if (Menu[index].externalLink)
      window.location.href = Menu[index].url;
    else {
      this.setState({
        itemMenuSeleccionado: Menu[index]
      });

      this.props.onPaginaClick(Menu[index].url);
    }
  };

  render() {
    const { classes, open, paraMobile, modoInvitado } = this.props;

    return (
      <SwipeableDrawer
        onClose={this.handleDrawerClose}
        onOpen={this.handleDrawerOpen}
        variant={paraMobile ? "temporary" : "permanent"}
        classes={{
          paper: classNames(
            classes.drawerPaper,
            paraMobile == false && !open && classes.drawerPaperClose,
            classes.menuStyle
          )
        }}
        ModalProps={{
          keepMounted: true // Better open performance on mobile.
        }}
        open={open}
      >
        {/* <DrawerComponent {...this.props}> */}
        {paraMobile == false && (
          <div className={classes.toolbarIcon}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
        )}

        <List component="nav" className="navMenu">
          {Menu.map((item, index) => {
            if (item.mostrarEnMenu == false ||
              (modoInvitado && item.mostrarUserInvitado == false) ||
              (!modoInvitado && item.mostrarUserVV == false)) return null;

            return (
              <DrawerItem
                key={index}
                index={index}
                texto={item.nombre || "Sin texto"}
                seleccionado={this.state.itemMenuSeleccionado.url == item.url}
                onClick={this.onDrawerItemClick}
              />
            );
            // return (
            //   <ListItem
            //     button
            //     key={index}
            //     onClick={() => {
            //       this.props.onPaginaClick(item.url);
            //     }}
            //     selected={paginaActual.url == item.url}
            //   >
            //     {item.icono != undefined && (
            //       <ListItemIcon>
            //         <Icon>{item.icono}</Icon>
            //       </ListItemIcon>
            //     )}
            //     <ListItemText primary={item.nombre} />
            //   </ListItem>
            // );
          })}
        </List>
      </SwipeableDrawer>
    );
  }
}

const drawerWidth = 240;
const styles = theme => {
  return {
    toolbarIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 8px",
      ...theme.mixins.toolbar
    },
    drawerPaper: {
      overflow: "hidden",
      position: "relative",
      whiteSpace: "nowrap",
      backgroundColor: theme.palette.background.default,
      width: drawerWidth,
      borderRight: "none",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    drawerParaMobile: {
      backgroundColor: "white"
    },
    drawerEscritorio: {
      backgroundColor: theme.palette.secondary.light
    },
    drawerPaperClose: {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      width: 0, //theme.spacing.unit * 7,
      [theme.breakpoints.up("sm")]: {
        width: 0, //theme.spacing.unit * 9
      }
    },
    menuStyle: {
      boxShadow: '4px 0px 16px -3px rgba(0,0,0,0.75)',
      background: '#fff'
    }
  };
};

export default withStyles(styles)(MiDrawer);

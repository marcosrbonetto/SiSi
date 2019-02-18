import React from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";

//Componentes
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";

class DrawerItem extends React.PureComponent {
  onClick = () => {
    if (this.props.onClick === undefined) return;
    this.props.onClick(this.props.index);
  };

  render() {
    const { classes } = this.props;

    return (
      <ListItem
        button
        className={classes.listItem}
        onClick={this.onClick}
        selected={this.props.seleccionado}
      >
        {this.props.icono !== undefined && (
          <ListItemIcon>
            <Icon
              className={classNames(
                classes.icono,
                this.props.seleccionado && classes.iconoSeleccionado
              )}
            >
              {this.props.icono}
            </Icon>
          </ListItemIcon>
        )}
        <ListItemText
          primary={this.props.texto}
          className={classNames(
            classes.texto,
            this.props.seleccionado && classes.textoSeleccionado
          )}
        />
      </ListItem>
    );
  }
}

const styles = theme => {
  return {
    listItem: {
      borderTopRightRadius: "2rem",
      borderBottomRightRadius: "2rem",
      overflow: 'hidden'
    },
    texto: {
      "& span": {
        color: "#888"
      }
    },
    textoSeleccionado: {
      "& span": {
        fontWeight: 500,
        color: theme.palette.secondary.main
      }
    },
    icono: {
      color: "#888"
    },
    iconoSeleccionado: {
      color: theme.palette.secondary.main
    }
  };
};

export default withStyles(styles)(DrawerItem);

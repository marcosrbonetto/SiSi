import React from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";

import MiToolbar from "@Componentes/MiToolbar";

class MiPagina extends React.PureComponent {
  render() {
    let { classes } = this.props;

    return (
      <React.Fragment>
        <div className={classes.root}>
          <MiToolbar
            leftIconClick={this.props.toolbarLeftIconClick}
            leftIcon={this.props.toolbarLeftIcon}
            titulo="#CBA147"
            cargando={this.props.cargando}
          />

          {/* Contenido */}
          <div className={classes.main}>
            <div className={classes.separadorToolbar} />
            <div className={classes.content}>{this.props.children}</div>
          </div>

          <div
            className={classNames(
              classes.contentOverlayCargando,
              this.props.cargando == true &&
                classes.contentOverlayCargandoVisible
            )}
          />
        </div>
      </React.Fragment>
    );
  }
}

const styles = theme => ({
  root: {
    display: "flex",
    width: "100%",
    height: "100vh"
  },

  main: {
    width: "100%",
    display: "flex",
    flexDirection: "column"
  },
  separadorToolbar: theme.mixins.toolbar,
  content: {
    flex: 1,
    width: "100%"
  },
  contentOverlayCargando: {
    backgroundColor: "rgba(255,255,255,0.6)",
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: theme.zIndex.drawer + 1,
    top: 0,
    bottom: 0,
    opacity: 0,
    pointerEvents: "none",
    transition: "opacity 0.3s"
  },
  contentOverlayCargandoVisible: {
    opacity: 1
    // pointerEvents: 'auto',
  }
});

let componente = MiPagina;
componente = withStyles(styles)(componente);
export default componente;

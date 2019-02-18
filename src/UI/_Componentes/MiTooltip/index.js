import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Tooltip from '@material-ui/core/Tooltip';

class MiTooltip extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    let { classes } = this.props;

    return (
      <div className={classes.root}>
        <Tooltip
          disableFocusListener disableTouchListener 
          classes={{ tooltip: classes.lightTooltip }}
          title={this.props.contenidoDetalle}>
          {this.props.children}
        </Tooltip>
      </div>
    );
  }
}

const styles = theme => ({
  lightTooltip: {
    background: 'rgba(255,255,255, 1)',
    color: 'blue',
    fontSize: '11px',
    boxShadow: '0px 0px 4px 1px rgba(0,0,0,0.75)'
  }
});

let componente = MiTooltip;
componente = withStyles(styles)(componente);
export default componente;

import React from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";

import { Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

class MiDatoPerfil extends React.PureComponent {
  render() {
    let { classes } = this.props;

    return (
      <React.Fragment>
        <div className={classes.classContainer}>
          {(this.props.iconoSvg && <div className={classes.classIconoSvg}>{this.props.iconoSvg}</div>) || <i className={classNames("material-icons", classes.classIcono)}>{this.props.icono || 'assignment'}</i>}
          <div className={classes.classTextos}>
            <Typography variant="body2">{this.props.texto}</Typography>
            <Typography variant="caption">{this.props.subtexto}</Typography>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const styles = theme => ({
  classContainer: {
    display: 'flex'
  },
  classIcono: {
    margin: '6px',
    color: theme.color.block.main
  },
  classTextos: {
    '& > *:nth-child(1)': {
      height: '18px'
    }
  },
  classIconoSvg: {
    width: '20px',
    height: '20px',
    margin: '8px',
    fill: '#737373',
  }
});

export default withStyles(styles)(MiDatoPerfil);

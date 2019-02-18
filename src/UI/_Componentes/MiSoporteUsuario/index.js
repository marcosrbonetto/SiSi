import React from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import Tooltip from '@material-ui/core/Tooltip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

class MiSoporteUsuario extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    }
  }

  handleTooltipOpen = () => {
    this.setState({ open: true });
  };

  handleTooltipClose = () => {
    this.setState({ open: false });
  };

  render() {
    let { classes } = this.props;
    let { open } = this.state;
    const email = window.Config.EMAIL_SOPORTE || '';

    return (
      <ClickAwayListener onClickAway={this.handleTooltipClose}>
        <Tooltip
          open={open}
          classes={{ tooltip: classes.textTooltip }}
          title={
            <span>Por cualquier consulta o problema, <br />comuniquese al siguiente e-mail:<br /> {email}</span>
          }
          disableFocusListener
          disableHoverListener
          disableTouchListener
          interactive>
          <Button onClick={this.handleTooltipOpen} className={classes.button} color="secondary">
            <i class="material-icons">announcement</i>
            <span className={classes.btnAnimation}>Soporte</span>
          </Button>
        </Tooltip>
      </ClickAwayListener>
    );
  }
}

const styles = theme => ({
  button: {
    position: 'fixed',
    left: '0px',
    bottom: '0px',
    zIndex: '9999999999999999',
    '&:hover > span > span': {
      width: '100px'
    }
  },
  btnAnimation: {
    width: '0px',
    overflow: 'hidden',
    transition: 'width 2s',
  },
  textTooltip: {
    fontSize: 16,
  }
});

export default withStyles(styles)(MiSoporteUsuario);

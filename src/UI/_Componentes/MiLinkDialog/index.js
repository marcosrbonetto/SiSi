import React from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import { connect } from "react-redux";

import { Typography } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from "@material-ui/core/Button";

class MiLinkDialog extends React.PureComponent {

  constructor(props) {
    super(props);

    this.paraMobile = this.props.paraMobile || false;

    this.state = {
      open: false
    }
  }

  getComponent(key) {

    if (Array.isArray(this.props.children) && this.props.children.filter((seccion)=>{return seccion.key == "mainContent"}).length > 0)
      return this.props.children.filter((comp) => {
        return comp.key === key;
      });
    else if (key == 'mainContent')
      return this.props.children

    return false;
  }
  
  handleOpenModal = event => {

    //Si hay acción externa la ejecutamos
    if(this.props.onExternalAction) {
      const finish = this.props.onExternalAction();

      if(finish)
        return false;
    }

    this.setState({
      open: true
    });
  };

  handleCloseModal = (event) => {
    this.setState({
      open: false
    });
  };

  handleAcceptEvent = (event) => {
    if(this.props.acceptEvent)
      this.props.acceptEvent(this.props.acceptEventData);

    this.handleCloseModal();
  };

  handleCancelEvent = (event) => {
    if(this.props.cancelEvent)
      this.props.cancelEvent(this.props.cancelEventData);

    this.handleCloseModal();
  };

  render() {
    let { classes, titulo, textoLink } = this.props;

    return (
      <div>
        {!this.props.buttonAction &&
          <Typography
            onClick={this.handleOpenModal}
            variant="subheading" className={classNames(classes.textList, classes.link)} gutterBottom>{textoLink}</Typography>
        }
        {this.props.buttonAction && 
          <div onClick={this.handleOpenModal}>
            {this.getComponent('buttonAction')}
          </div>
        }
        <Dialog
          open={this.state.open || false}
          scroll='paper'
          aria-labelledby="scroll-dialog-title"
          classes={{
              paper: (this.paraMobile && classes.paraMobile) || classes.root
          }}
        >
          <DialogTitle id="scroll-dialog-title">{titulo}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {this.getComponent('headerContent')}
              {this.getComponent('mainContent')}
              {this.getComponent('footerContent')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {(this.props.buttonOptions && 
            <div>
              <Button onClick={this.handleCancelEvent} color="secondary">
                {this.props.labelCancel ? this.props.labelCancel : 'Cancelar'}
              </Button>
              <Button onClick={this.handleAcceptEvent} color="secondary">
                {this.props.labelAccept ? this.props.labelAccept : 'Aceptar'}
              </Button>
            </div>
            ) || 
            <Button onClick={this.handleCloseModal} color="secondary">
              Cerrar
            </Button>}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const styles = theme => ({
  textList: {
    lineHeight: '28px',
    position: 'relative',
    top: '2px'
  },
  link: {
    color: theme.color.info.main,
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  paraMobile: {
    margin: '0px !important',
    position: 'fixed !important',
    width: '100% !important',
    height: '100% !important',
    maxWidth: '100% !important',
    maxHeight: '100% !important',
  }
});

let componente = undefined;
componente = withStyles(styles)(MiLinkDialog);
componente = connect(
  null,
  null
)(componente);
export default componente;
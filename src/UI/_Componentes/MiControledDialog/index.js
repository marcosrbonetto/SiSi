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
import Tooltip from '@material-ui/core/Tooltip';

class MiControledDialog extends React.PureComponent {

  constructor(props) {
    super(props);

    this.paraMobile = this.props.paraMobile || false;
  }

  getComponent(key) {

    if (Array.isArray(this.props.children) && this.props.children.filter((seccion) => { return seccion.key == "mainContent" }).length > 0)
      return this.props.children.filter((comp) => {
        return comp.key === key;
      });
    else if (key == 'mainContent')
      return this.props.children

    return false;
  }

  handleOpenModal = event => {

    if (this.props.promiseBeforeOpen) {
      this.props.promiseBeforeOpen()
        .then(() => {
          this.props.onDialogoOpen && this.props.onDialogoOpen();
        });
      return;
    }

    this.props.onDialogoOpen && this.props.onDialogoOpen();
  };

  handleCloseModal = (event) => {
    this.props.onDialogoClose && this.props.onDialogoClose();
  };

  handleAcceptEvent = () => {
    this.props.buttonOptions.onDialogoAccept && this.props.buttonOptions.onDialogoAccept();
  }

  handleCancelEvent = () => {
    this.props.buttonOptions.onDialogoCancel && this.props.buttonOptions.onDialogoCancel();
  }

  render() {
    let { classes,
      titulo,
      subtitulo,
      textoLink,
      textoInformativo,
      classTextoLink,
      botonera,
      classContainterContent,
      buttonOptions,
    } = this.props;

    return (
      <div>
        {!this.props.buttonAction &&
          <Typography
            onClick={this.handleOpenModal}
            variant="subheading" className={classNames(classes.textList, classes.link, classTextoLink)} gutterBottom>{textoLink}</Typography>
        }
        {this.props.buttonAction &&
          <div>
            {this.getComponent('buttonAction')}
          </div>
        }
        <Dialog
          open={this.props.open || false}
          scroll='paper'
          aria-labelledby="scroll-dialog-title"
          classes={{
            paper: (this.paraMobile && classes.paraMobile) || (this.props.classMaxWidth ? this.props.classMaxWidth : classes.maxWidth)
          }}
          onClose={this.handleCloseModal}
        >
          {titulo && <DialogTitle id="scroll-dialog-title">
            {titulo}{subtitulo && <React.Fragment><br/><span className={classes.subtitulo}>{subtitulo}</span></React.Fragment>}
            {textoInformativo &&
              <Tooltip
                disableFocusListener disableTouchListener
                classes={{ tooltip: classes.textTooltip }}
                title={
                  textoInformativo
                }
              >
                <i className={classNames(classes.infoIcon, "material-icons")}>info</i>
              </Tooltip>}
          </DialogTitle>}
          <DialogContent className={classNames(classes.content, classContainterContent)}>
            <DialogContentText>
              {this.getComponent('headerContent')}
              {this.getComponent('mainContent')}
              {!this.props.footerFixed && this.getComponent('footerContent')}
            </DialogContentText>
          </DialogContent>
          {this.props.footerFixed && this.getComponent('footerContent')}
          <DialogActions>
            {botonera &&
              <React.Fragment>
                {botonera}
              </React.Fragment>
              ||
              (buttonOptions &&
                <div>
                  <Button onClick={this.handleCancelEvent} color="primary">
                    {buttonOptions.labelCancel || 'Cancelar'}
                  </Button>
                  <Button onClick={this.handleAcceptEvent} color="primary">
                    {buttonOptions.labelAccept || 'Aceptar'}
                  </Button>
                </div>
              ) ||
              <Button onClick={this.handleCloseModal} color="primary">Cerrar</Button>}
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
  maxWidth: {
    maxWidth: '900px'
  },
  content: {
    paddingBottom: '0px'
  },
  paraMobile: {
    margin: '0px !important',
    position: 'fixed !important',
    width: '100% !important',
    height: '100% !important',
    maxWidth: '100% !important',
    maxHeight: '100% !important',
  },
  textTooltip: {
    fontSize: 12,
    maxWidth: '460px'
  },
  infoIcon: {
    color: '#0f8fea',
    verticalAlign: 'middle',
    cursor: 'pointer'
  },
  subtitulo: {
    fontSize: '0.6em'
  }
});

let componente = undefined;
componente = withStyles(styles)(MiControledDialog);
componente = connect(
  null,
  null
)(componente);
export default componente;
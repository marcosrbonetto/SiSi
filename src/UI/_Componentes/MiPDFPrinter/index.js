import React from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";

import Button from "@material-ui/core/Button";

import { exportPDFIE, esIE } from '@Utils/internetExplorerFunctions';

class MiPDFPrinter extends React.PureComponent {

  printFile = () => {
    const { base64File, textoFile, callback } = this.props;

    exportPDFIE(base64File, textoFile);

    callback && callback();
  }

  render() {
    let { classes, rootClassName, base64File, descargaDirecta, textoLink, textoFile, buttonStyle } = this.props;

    // Internet Explorer 6-11
    var isIE = esIE();

    return (
      <div className={rootClassName || classes.root}>
        {base64File != '' && <div>
          {isIE && <Button
            variant="outlined"
            color="secondary"
            onClick={this.printFile}
            className={buttonStyle || classes.bottonDescarga}
          >
            {textoLink}
          </Button>
            ||
            <div>
              {descargaDirecta &&
                <Button
                  size="small"
                  variant="outlined"
                  color="secondary"
                  href={base64File}
                  download={textoFile}
                  className={buttonStyle || classes.bottonDescarga}
                >{textoLink}</Button>
                ||
                <object data={base64File} type="application/pdf" className={classes.sizePDF}>
                  <a className={buttonStyle || classes.bottonDescarga} href={base64File} download>{textoLink}</a>
                </object>}
            </div>}
        </div>}
        {base64File == '' && <div style={{ color: 'red' }}>{this.props.mensajeError || "Se están presentando inconvenientes para generar el cedulón, intente más tarde."}</div>}
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    display: 'inline-block'
  },
  bottonDescarga: {
    borderColor: '#46b8da',
    color: '#46b8da',
  },
  sizePDF: {
    width: 'calc(100% - 46px)',
    height: 'calc(100% - 136px)',
    position: 'absolute'
  }
});

export default withStyles(styles)(MiPDFPrinter);

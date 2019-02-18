import React from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";

import MiControledDialog from "@Componentes/MiControledDialog";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import { getTextoTipoTributoById } from "@Utils/functions"

import { arrayIdTipoTributoInfo, infoExplicativaTributos } from '@UI/Paginas/TributarioOnline/DetalleTributario/infoExplicativaTributos.js';

class MiInformacionTributos extends React.Component {
  constructor(props) {
    super(props);

    let mostrarInfo = true;
    const timeInfoTributos = localStorage.getItem("timeInfoTributos");
    if(timeInfoTributos)
      mostrarInfo = false;

    localStorage.setItem("timeInfoTributos", new Date().getTime());

    // Por tiempo
    // var tomorrow = new Date();
    // tomorrow.setDate(tomorrow.getDate() + 1);
    // if(timeInfoTributos && timeInfoTributos <= tomorrow.getTime()) {
    //   mostrarInfo = false;
    // } else {
    //   localStorage.setItem("timeInfoTributos", new Date().getTime());
    // }

    this.state = {
      dialogoOpen: mostrarInfo
    }
  }

  onDialogoOpen = () => {
    this.setState({
      dialogoOpen: true
    });
  }

  onDialogoClose = () => {
    this.setState({
      dialogoOpen: false
    });
  }

  render() {
    let { classes } = this.props;

    const arrayIdTributos = arrayIdTipoTributoInfo();

    return (
      <div className={classNames(classes.root)}>
        <MiControledDialog
          paraMobile={this.props.paraMobile}
          open={this.state.dialogoOpen}
          onDialogoClose={this.onDialogoClose}
          buttonAction={true}
          textoLink={'Información de Tributos'}
          titulo={'Información de Tributos'}
          classMaxWidth={classes.maxWidth}
        >
          <div key="buttonAction">
            <Button onClick={this.onDialogoOpen} className={classNames(classes.btnInfoTributos, "btnInfoTributos")} variant="outlined" color="secondary">
              Información de Tributos
            </Button>
          </div>

          <div key="mainContent">
            {arrayIdTributos.map((idTributo) => {
              const tituloTributo = getTextoTipoTributoById(idTributo);
              const infoTributo = infoExplicativaTributos(idTributo);

              return infoTributo && <div>
                <Typography variant="title" className={classes.tributoTitle}>
                  {tituloTributo}
                </Typography>
                <div className={classes.tributoContent}>{infoTributo}</div> <br /><br />
              </div>;
            })}
          </div>
        </MiControledDialog>
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    textAlign: 'right',
    right: '20px',
    '& > *': {
      display: 'inline-block'
    }
  },
  maxWidth: {
    maxWidth: '900px'
  },
  btnInfoTributos: {
    marginRight: '10px',
    marginTop: '5px',
    marginBottom: '5px',
  },
  tributoContent: {
    display: 'block',
    background: '#ece3e3',
    padding: '10px',
  },
  tributoTitle: {
    marginBottom: '10px'
  }
});

export default withStyles(styles)(MiInformacionTributos);

import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//Alert
import { mostrarAlerta } from "@Utils/functions";

import { Typography } from "@material-ui/core";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from "@material-ui/core/Button";

import MiControledDialog from "@Componentes/MiControledDialog";
import MiPDFPrinter from "@Componentes/MiPDFPrinter";

import services from '@Rules/Rules_TributarioOnline';
import { mostrarCargando } from '@Redux/Actions/mainContent';

const mapStateToProps = state => {
  return {
    loggedUser: state.Usuario.loggedUser,
    paraMobile: state.MainContent.paraMobile,
  };
};

const mapDispatchToProps = dispatch => ({
  mostrarCargando: (cargar) => {
    dispatch(mostrarCargando(cargar));
  },
});

class MiCedulon extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      mensajeError: undefined,
      base64Cedulon: '',
      disabled: this.props.disabled
    };
  }

  componentWillReceiveProps(nextProps) {

    if (JSON.stringify(this.props.disabled) != JSON.stringify(nextProps.disabled)) {
      this.setState({
        disabled: nextProps.disabled
      });
    }
  }

  handleClick = event => {
    const target = event.currentTarget;

    //Vemos si tiene un acción antes de mostrar el listado
    if (this.props.onClick) {
      this.props.onClick((tieneBeneficio) => {
        if (tieneBeneficio)
          this.onBotonCedulonClick();
        else
          this.setState({ anchorEl: target });
      });
    } else {
      this.setState({ anchorEl: target });
    }

  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  onBotonCedulonClick = (event) => {

    this.setState({
      anchorEl: null,
    });

    this.props.mostrarCargando(true);
    const registros = this.props.registrosSeleccionados;
    const token = this.props.loggedUser.token;
    const opcion = event && event.currentTarget.attributes.opcion.value || 0;

    const tieneBeneficio = this.props.tieneBeneficio || false;

    if (registros.length > 0 || this.props.esJuicio || this.props.allSelected) {
      services.getReporteCedulon(token,
        {
          "tipoTributo": parseInt(this.props.tipoTributo),
          "identificador": this.props.identificador,
          "opcionVencimiento": parseInt(opcion),
          "periodos": registros,
          "tipoCedulon": this.props.tipoCedulon,
          "subItem": this.props.subItemSeleccionado || this.props.subItem,
          "esPagoElectronico": false,
          "esCuotaGlobal": tieneBeneficio
        })
        .then((datos) => {
          if (!datos.ok) {
            this.setState({
              base64Cedulon: '',
              dialogoOpen: true,
              mensajeError: datos.error
            });
            this.props.mostrarCargando(false);
            return false;
          } //mostrarAlerta(datos.error); 

          const resultData = datos.return;

          this.setState({
            base64Cedulon: resultData && resultData.reporte ? 'data:application/pdf;base64,' + resultData.reporte : '',
            dialogoOpen: true,
            mensajeError: undefined
          });
          this.props.mostrarCargando(false);
        })
        .catch((err) => {
          console.log(err);
          this.props.mostrarCargando(false);
        });
    } else {
      this.setState({
        base64Cedulon: '',
        dialogoOpen: true
      });
      this.props.mostrarCargando(false);
    }
  }

  onDialogoOpen = () => {
    this.setState({ dialogoOpen: true });
  }

  onDialogoClose = () => {
    this.setState({ dialogoOpen: false });
  }

  render() {
    let { classes } = this.props;

    return (
      <div className={classes.root}>
        <MiControledDialog
          paraMobile={this.props.paraMobile}
          open={this.state.dialogoOpen}
          onDialogoOpen={this.onDialogoOpen}
          onDialogoClose={this.onDialogoClose}
          buttonAction={true}
          textoLink={'Cedulon'}
          titulo={'Cedulon'}
          classMaxWidth={classes.maxWidth}
        >
          <div key="buttonAction">
            <Button
              variant="contained"
              color="secondary"
              className={classes.buttonActions}
              onClick={this.handleClick}
              disabled={this.state.disabled}
            >
              CEDULÓN
          <Typography className={classes.buttonActionsCaption} variant="caption" gutterBottom align="center">
                Pago Efectivo
          </Typography>
            </Button>
            <Menu
              anchorEl={this.state.anchorEl}
              open={Boolean(this.state.anchorEl)}
              onClose={this.handleClose}
            >
              <MenuItem onClick={this.onBotonCedulonClick} opcion="0">Hoy</MenuItem>
              <MenuItem onClick={this.onBotonCedulonClick} opcion="10">A Días</MenuItem>
            </Menu>
          </div>

          <div key="mainContent">
            <MiPDFPrinter
              base64File={this.state.base64Cedulon}
              textoLink={'Descargar Cedulón'}
              textoFile={'Cedulón'}
              callback={this.onDialogoClose}
            />
          </div>
        </MiControledDialog>
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    display: 'inline-block'
  },
  buttonActions: {
    overflow: 'visible',
    display: 'inline-block',
    minWidth: 'auto',
    margin: '2px',
    borderRadius: '20px',
  },
  buttonActionsCaption: {
    top: '40px',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90px'
  },
  maxWidth: {
    minWidth: '100%',
    minHeight: '100%',
  }
});

let componente = MiCedulon;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
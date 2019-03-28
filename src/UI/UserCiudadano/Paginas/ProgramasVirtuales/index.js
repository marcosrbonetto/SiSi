import React from "react";
import { withRouter } from "react-router-dom";

import { push } from "connected-react-router";

//Styles
import styles from './styles'
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import classNames from "classnames";

//Assets
import Logo_SiSi from "@Assets/images/Logo_SiSi.png";
import { mostrarAlerta, mostrarMensaje } from "@Utils/functions";

//Redux
import { mostrarCargando } from '@Redux/Actions/mainContent';
import { actualizarPreinscipcion } from '@Redux/Actions/usuario';

//Material UI 
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from "@material-ui/core/Button";
import Icon from '@material-ui/core/Icon';

//Componentes
import MiControledDialog from "@Componentes/MiControledDialog";
import SeleccionPrograma from '@ComponentesProgramasVirtuales/SeleccionPrograma'

import Rules_Preinscripcion from "@Rules/Rules_Preinscripcion";
import Rules_Programas from "@Rules/Rules_Programas";

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
  actualizarPreinscipcion: (data) => {
    dispatch(actualizarPreinscipcion(data));
  },
  redireccionar: url => {
    dispatch(push(url));
  },
});

class ProgramasVirtuales extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      listaProgramas: undefined,
    };
  }

  componentDidMount() {
    this.cargarProgramas();
  }

  cargarProgramas = () => {
    this.props.mostrarCargando(true);
    const token = this.props.loggedUser.token;

    Rules_Programas.getProgramasVirtuales(token)
      .then((datos) => {
        this.props.mostrarCargando(false);
        if (!datos.ok) {
          mostrarAlerta('Ocurrió un error al intentar obtener los programas.');
          return false;
        }

        this.setState({
          listaProgramas: datos.return
        });
      })
      .catch((error) => {
        this.props.mostrarCargando(false);
        mostrarAlerta('Ocurrió un error al intentar obtener los programas.');
        console.error('Error Servicio "Rules_Preinscripcion.getProgramas": ' + error);
      });
  }

  volverInicio = () => {
    this.props.redireccionar("/Inicio");
  }

  render() {
    const { classes } = this.props;
    const { listaProgramas } = this.state;

    return (
      <div className={classes.mainContainer}>

        <Grid container spacing={16} justify="center">
          {listaProgramas &&
            <React.Fragment>
              {listaProgramas.length > 0 &&

                <Grid item xs={12} sm={6}>

                  {listaProgramas.map((programa, index) => {
                    return <React.Fragment>
                      <SeleccionPrograma
                        tituloPrograma={programa.nombre}
                        classTituloPrograma={classes.tituloPrograma}
                        textoInformativo={programa.descripcion}
                        arrayCursos={programa.cursos}
                      />

                      {index != (listaProgramas.length - 1) && <React.Fragment><br /><br /><br /></React.Fragment> || <br/>}
                    </React.Fragment>
                  })}

                  <div className={classes.textCenter}>
                    <Button onClick={this.volverInicio} variant="outlined" color="primary" className={classes.button}>
                      <Icon className={classNames(classes.iconoBoton, classes.secondaryColor)}>arrow_back_ios</Icon>
                      Atrás</Button>
                  </div>

                </Grid>

                ||
                <Grid item xs={12} sm={12} className={classes.seccionCenter}>
                  <Typography variant="body2" gutterBottom className={classes.informacion} style={{ textAlign: 'center' }}>
                    De acuerdo a su estado actual, no se presentan programas disponibles para usted.</Typography>

                  <div className={classes.textCenter}>
                    <Button onClick={this.volverInicio} variant="outlined" color="primary" className={classes.button}>
                      <Icon className={classNames(classes.iconoBoton, classes.secondaryColor)}>arrow_back_ios</Icon>
                      Atrás</Button>
                  </div>
                </Grid>}
            </React.Fragment>}
        </Grid>

      </div>
    );
  }
}

let componente = ProgramasVirtuales;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
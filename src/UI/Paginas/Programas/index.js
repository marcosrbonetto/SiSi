import React from "react";
import { withRouter } from "react-router-dom";

//Styles
import styles from './styles'
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import classNames from "classnames";

//Redux
import { mostrarCargando } from '@Redux/Actions/mainContent'

//Material UI 
import Grid from '@material-ui/core/Grid';

import SeleccionPrograma from '@ComponentesProgramas/SeleccionPrograma'

const mapStateToProps = state => {
  return {
    loggedUser: state.Usuario.loggedUser,
    paraMobile: state.MainContent.paraMobile,
  };
};

const mapDispatchToProps = dispatch => ({
  mostrarCargando: (cargar) => {
    dispatch(mostrarCargando(cargar));
  }
});

class Programas extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentWillMount() {

  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.mainContainer}>
        <Grid container spacing={16} justify="center">
          <Grid item xs={12} sm={6}>


            <SeleccionPrograma
              tituloPrograma={'SI ESTUDIO +24'}
              classTituloPrograma={classes.tituloPrograma}
              textoInformativo={'1000 oportunidades para 38 Cursos de Formación Profesional (CFP) que dura 3 meses promedio.'}
            />
            
            <br/><br/><br/>

            <SeleccionPrograma
              tituloPrograma={'SI TRABAJO'}
              classTituloPrograma={classes.tituloPrograma}
              textoInformativo={'Hasta 1000 Prácticas Laborales para egresados de los Cursos de Formación Profesional (CFP) en empresas oferentes o la empresa que nos propongas. Media jornada - 20 horas semanales (hasta 6 meses sin relación laboral - con una remuneración de $ 3600 por mes.'}
            />

          </Grid>
        </Grid>
      </div>
    );
  }
}

let componente = Programas;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
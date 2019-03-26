import React from "react";
import { withRouter } from "react-router-dom";
import CordobaFilesUtils from "@Utils/CordobaFiles";

import _ from "lodash";

//Styles
import styles from './styles'
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import classNames from "classnames";

//Redux
import { mostrarCargando } from '@Redux/Actions/mainContent'
import { push } from "connected-react-router";

//Material UI 
import Grid from '@material-ui/core/Grid';
import MiCard from "@Componentes/MiCard";


import CV from "@ComponentesCurriculumVitae/CV";

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
  redireccionar: url => {
    dispatch(push(url));
  },
});

class CurriculumVitae extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const {
      classes
    } = this.props;

    return (
      <div className={classes.mainContainer}>
        <Grid container spacing={16} justify="center">
          <Grid item xs={12} sm={8}>
            <MiCard>
              <CV />
            </MiCard>
          </Grid>
        </Grid>
      </div>
    );
  }
}

let componente = CurriculumVitae;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
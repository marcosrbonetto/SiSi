import React from "react";
import { withRouter } from "react-router-dom";

//Styles
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import classNames from "classnames";

//Redux
import { mostrarCargando } from '@Redux/Actions/mainContent'

//Material UI 
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import Button from "@material-ui/core/Button";

//Mis Componentes
import MiCard from "@Componentes/MiNewCard";
import MiInput from "@Componentes/MiInput";

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

class DomicilioParticular extends React.PureComponent {
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
      <React.Fragment>
        <MiCard
          titulo={'Domicilio particular'}
          seccionBotones={{
            align: 'right',
            content: <Button variant="outlined" color="primary" className={classes.button}>
            <Icon className={classNames(classes.iconoBoton, classes.secondaryColor)}>create</Icon>
            Modificar</Button>
          }}
        >
          <Grid container spacing={16}>
            <Grid item xs={12} sm={8}>
              <MiInput
                tipoInput={'input'}
                label={'Dirección'}
                defaultValue={'Parana'}
              />
              <br />
              <Grid container>
                <Grid item xs={12} sm={6}>
                  <MiInput
                    tipoInput={'input'}
                    label={'Torre'}
                    defaultValue={'lala'}
                    placeholder={'(Opcional)'}
                  />
                </Grid>
                <br />
                <Grid item xs={12} sm={6}>
                  <MiInput
                    tipoInput={'input'}
                    label={'Piso'}
                    defaultValue={'8'}
                  />
                </Grid>
              </Grid>
              <br />
              <MiInput
                tipoInput={'select'}
                label={'Barrio'}
                defaultValue={0}
                itemsSelect={
                  [
                    {
                      value: 0,
                      label: 'Seleccione...'
                    },
                    {
                      value: 1,
                      label: 'Barrio 1'
                    },
                    {
                      value: 2,
                      label: 'Barrio 2'
                    },
                    {
                      value: 3,
                      label: 'Barrio 3'
                    },
                  ]
                }
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <MiInput
                tipoInput={'input'}
                label={'Altura'}
                defaultValue={'441'}
              />
              <br />
              <MiInput
                tipoInput={'input'}
                label={'Depto'}
                defaultValue={'B'}
              />
            </Grid>
          </Grid>
        </MiCard>
      </React.Fragment>
    );
  }
}

const styles = theme => ({
  bottomContent: {
    display: 'flex',
    alignItems: 'flex-end',
  }
});

let componente = DomicilioParticular;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
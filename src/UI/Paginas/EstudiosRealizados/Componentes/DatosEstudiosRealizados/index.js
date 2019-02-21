import React from "react";
import { withRouter } from "react-router-dom";

//Styles
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import classNames from "classnames";

//Redux
import { mostrarCargando } from '@Redux/Actions/mainContent'

//Material UI
import Icon from '@material-ui/core/Icon';
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

//Mis Componentes
import MiCard from "@Componentes/MiNewCard";
import MiInput from "@Componentes/MiInput";

import MiControledDialog from "@Componentes/MiControledDialog";

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

class DatosEstudiosRealizados extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      dialogoOpen: false
    };
  }

  componentWillMount() {

  }

  onDialogoOpen = () => {
    this.setState({ dialogoOpen: true });
  }

  onDialogoClose = () => {
    this.setState({ dialogoOpen: false });
  }

  render() {
    const { classes } = this.props;
    const { dialogoOpen } = this.state;

    return (
      <React.Fragment>
        <MiCard
          informacionAlerta={'Cargá acá tus estudios realizados, desde el secundario hasta el nivel que haya alzcanzado'}
          seccionBotones={{
            align: 'right',
            content: <Button variant="outlined" color="primary" className={classes.button}>
              <Icon className={classNames(classes.iconoBoton, classes.secondaryColor)}>create</Icon>
              Guardar</Button>
          }}
        >

          <MiInput
            tipoInput={'checkbox'}
            label={'No tengo ningún estudio realizado'}
            checked={true}
          />

          <MiControledDialog
            open={dialogoOpen}
            onDialogoOpen={this.onDialogoOpen}
            onDialogoClose={this.onDialogoClose}
            textoLink={'Agregar'}
            titulo={'Agregar estudio realizado'}
            classTextoLink={classes.textoLink}
          >
            <Grid container>
              <Grid item xs={12} sm={12}>
                <MiInput
                  tipoInput={'select'}
                  label={'Tipo de estudio'}
                  defaultValue={1}
                  itemsSelect={
                    [
                      {
                        value: 1,
                        label: 'Carrera'
                      },
                      {
                        value: 2,
                        label: 'Curso'
                      },
                      {
                        value: 3,
                        label: 'Congreso'
                      },
                      {
                        value: 4,
                        label: 'Otro'
                      }
                    ]
                  }
                />
              </Grid>

              <br /><br /><br />
              <Grid item xs={12} sm={12}>
                <MiInput
                  tipoInput={'input'}
                  type={'text'}
                  label={'Descripción de la Institución'}
                  placeholder={'Ingrese el nombre de la institución...'}
                />
              </Grid>

              <br /><br /><br />
              <Grid container>
                <Grid item xs={12} sm={6}>
                  <MiInput
                    tipoInput={'input'}
                    type={'text'}
                    label={'Pueblo/Ciudad'}
                    placeholder={'Ingrese el pueblo o ciudad...'}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MiInput
                    tipoInput={'select'}
                    label={'Provincia'}
                    defaultValue={1}
                    itemsSelect={
                      [
                        {
                          value: 0,
                          label: 'Seleccione...'
                        },
                        {
                          value: 1,
                          label: 'Córdoba'
                        }
                      ]
                    }
                  />
                </Grid>
              </Grid>

              <br /><br /><br />
              <Grid item xs={12} sm={2}>
                <MiInput
                    tipoInput={'select'}
                    label={'Año de egreso'}
                    defaultValue={2019}
                    itemsSelect={
                      [
                        {
                          value: 2019,
                          label: '2019'
                        },
                        {
                          value: 2018,
                          label: '2018'
                        },
                        {
                          value: 2017,
                          label: '2017'
                        },
                        {
                          value: 2016,
                          label: '2016'
                        },
                      ]
                    }
                  />
              </Grid>

              <br /><br /><br />
              <Grid container>
                <Grid item xs={12} sm={6}>
                  <MiInput
                    tipoInput={'date'}
                    label={'Fecha de inicio'}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MiInput
                    tipoInput={'date'}
                    label={'Fecha de fin'}
                  />
                </Grid>
              </Grid>

            </Grid>
          </MiControledDialog>

        </MiCard>
      </React.Fragment>
    );
  }
}

const styles = theme => ({
  bottomContent: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  textoLink: {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
    marginLeft: '20px',
  }
});

let componente = DatosEstudiosRealizados;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
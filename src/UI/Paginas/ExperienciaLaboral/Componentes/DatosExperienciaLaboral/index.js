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
import CardExperienciaLaboral from '@ComponentesExperienciaLaboral/CardExperienciaLaboral'

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

class DatosExperienciaLaboral extends React.PureComponent {
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
          informacionAlerta={'Cargá acá tu último trabajo formal o informal. Por ej.: Atención del público en Centro de Salud. Recordá que es obligatorio. Podes cargar mas de una actividad.'}
          seccionBotones={{
            align: 'right',
            content: <Button variant="outlined" color="primary" className={classes.button}>
              <Icon className={classNames(classes.iconoBoton, classes.secondaryColor)}>create</Icon>
              Guardar</Button>
          }}
        >

          <MiInput
            tipoInput={'checkbox'}
            label={'No tengo experiencia laboral'}
            checked={true}
          />

          <MiControledDialog
            open={dialogoOpen}
            onDialogoOpen={this.onDialogoOpen}
            onDialogoClose={this.onDialogoClose}
            textoLink={'Agregar'}
            titulo={'Agregar experiencia laboral'}
            classTextoLink={classes.textoLink}
          >
            <Grid container>
              <Grid item xs={12} sm={12}>
                <MiInput
                  tipoInput={'input'}
                  type={'text'}
                  label={'Nombre de la empresa'}
                  placeholder={'Ingrese el nombre de la empresa...'}
                />
              </Grid>
              <br /><br /><br />
              <Grid item xs={12} sm={12}>
                <MiInput
                  tipoInput={'input'}
                  type={'text'}
                  label={'Descripción de la empresa'}
                  placeholder={'Describa la actividad de la empresa...'}
                />
              </Grid>
              <br /><br /><br />
              <Grid item xs={12} sm={12}>
                <MiInput
                  tipoInput={'input'}
                  type={'text'}
                  label={'Datos de contacto'}
                  placeholder={'Domicilio, Email, Teléfono, Referente...'}
                />
              </Grid>
              <br /><br /><br />
              <Grid item xs={12} sm={12}>
                <MiInput
                  tipoInput={'input'}
                  type={'text'}
                  label={'CUIT de la empresa'}
                  placeholder={'Si lo conoces, ingrese el CUIT de la empresa...'}
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

          <br/><br/>

          <div className={classes.itemsContainer}>
            <CardExperienciaLaboral />

            <CardExperienciaLaboral />

            <CardExperienciaLaboral />
          </div>

        </MiCard>
      </React.Fragment>
    );
  }
}

const styles = theme => ({
  itemsContainer: {
    display: 'flex',
    flexWrap: 'wrap'
  },
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

let componente = DatosExperienciaLaboral;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
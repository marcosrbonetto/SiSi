import React from "react";
import { withRouter } from "react-router-dom";

import _ from "lodash";

//Styles
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import classNames from "classnames";

//Redux
import { mostrarCargando } from '@Redux/Actions/mainContent';
import { actualizarExperienciasLaborales } from '@Redux/Actions/usuario';
import { mostrarAlerta, mostrarMensaje, stringToDate, dateToString } from "@Utils/functions";

//Material UI
import Icon from '@material-ui/core/Icon';
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';

//Mis Componentes
import MiCard from "@Componentes/MiNewCard";
import MiInput from "@Componentes/MiInput";

import CardExperienciaLaboral from '@ComponentesExperienciaLaboral/CardExperienciaLaboral';
import FormExperienciaLaboral from '@ComponentesExperienciaLaboral/FormExperienciaLaboral';

import Rules_ExperienciaLaboral from "@Rules/Rules_ExperienciaLaboral";

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
  actualizarExperienciasLaborales: (data) => {
    dispatch(actualizarExperienciasLaborales(data));
  }
});

class DatosExperienciaLaboral extends React.PureComponent {
  constructor(props) {
    super(props);

    const listaExperienciaLaboral = props.loggedUser.datos.experienciasLaborales;
    listaExperienciaLaboral.map((item, index) => {
      if (item.id) return true; //Cuando ya se seteo el ID no se deberá a realizar este proceso

      const randomId = "id_" + index + "_" + (new Date()).getTime() + parseInt(1 + Math.random() * (10 - 1));

      item.fechaInicio = item.fechaInicio ? dateToString(new Date(item.fechaInicio), 'DD/MM/YYYY') : '';
      item.fechaFinalizacion = item.fechaFinalizacion ? dateToString(new Date(item.fechaFinalizacion), 'DD/MM/YYYY') : '';
      item.id = randomId;
    });

    this.state = {
      listaExperienciaLaboral: listaExperienciaLaboral && listaExperienciaLaboral.length > 0 && listaExperienciaLaboral || []
    };
  }

  componentWillMount() {

  }

  agregarExperienciaLaboral = (experienciaLaboralAgregada) => {
    if (!experienciaLaboralAgregada) return false;

    //Agregamos ID
    const randomId = (new Date()).getTime() + parseInt(1 + Math.random() * (10 - 1));
    experienciaLaboralAgregada.id = randomId;

    this.setState({
      listaExperienciaLaboral: [...this.state.listaExperienciaLaboral, experienciaLaboralAgregada]
    }, () => {
      console.log(this.state.listaExperienciaLaboral);
    });
  }

  guardarExperienciaLaborales = () => {
    this.props.mostrarCargando(true);
    const token = this.props.loggedUser.token;
    const experienciasLaborales = this.state.listaExperienciaLaboral;

    Rules_ExperienciaLaboral.insertExperienciaLaboral(token, experienciasLaborales)
      .then((datos) => {
        this.props.mostrarCargando(false);
        if (!datos.ok) {
          mostrarAlerta('Ocurrió un error al intentar guardar las experiencias laborales');
          return false;
        }

        this.props.actualizarExperienciasLaborales(experienciasLaborales);
        mostrarMensaje('Experiencias laborales guardadas exitosamente!');
      })
      .catch((error) => {
        mostrarAlerta('Ocurrió un error al intentar guardar las experiencias laborales');
        console.error('Error Servicio "Rules_ExperienciaLaboral.insertExperienciaLaboral": ' + error);
      });
  }

  eliminarExperienciaLaboral = (idExpLab) => {
    const newArrayExpLab = _.filter(this.state.listaExperienciaLaboral, (expLab) => {
      return expLab.id != idExpLab;
    });

    this.setState({
      listaExperienciaLaboral: newArrayExpLab
    });
  }

  handleChangeOcupacion = () => {
    window.location.href = window.Config.URL_MI_PERFIL + "/#/?token=" + this.props.loggedUser.token + '&seccion=datosExtra&seccionMensaje=Modifique su ocupación para mantener su perfil actualizado.&redirect=' + encodeURIComponent(window.Config.URL_ROOT + '/Inicio/ExperienciaLaboral');
  }

  render() {
    const { classes, loggedUser } = this.props;
    const { listaExperienciaLaboral } = this.state;

    let tieneTrabajo = _.filter(listaExperienciaLaboral, (experienciaLaboral) => {
      return experienciaLaboral.fechaFinalizacion == '' || experienciaLaboral.fechaFinalizacion == null || experienciaLaboral.fechaFinalizacion == undefined;
    });
    const actualizarOcupacion = !loggedUser.datos.ocupacionId && tieneTrabajo.length > 0;

    return (
      <React.Fragment>
        <MiCard
          informacionAlerta={'Cargá acá tu último trabajo formal o informal. Por ej.: Atención del público en Centro de Salud. Recordá que es obligatorio. Podes cargar mas de una actividad.'}
          seccionBotones={{
            align: 'right',
            content: <Button onClick={this.guardarExperienciaLaborales} variant="outlined" color="primary" className={classes.button}>
              <Icon className={classNames(classes.iconoBoton, classes.secondaryColor)}>create</Icon>
              Guardar</Button>
          }}
        >

          {listaExperienciaLaboral.length == 0 && <MiInput
            tipoInput={'checkbox'}
            label={'No tengo experiencia laboral'}
            checked={true}
          />}

          <FormExperienciaLaboral
            handleExperienciaLaboralAgregada={this.agregarExperienciaLaboral}
          />

          {actualizarOcupacion &&
            <Typography variant="body2" className={classes.textoOcupacion}>
              <i className={classNames(classes.iconOcupacion, "material-icons")}>error</i> Segun sus experiencias laborales cargadas usted no se encuentra desocupado actualmente, actualice su ocupación de MuniOnline entrando <b style={{ cursor: 'pointer' }} onClick={this.handleChangeOcupacion}>aquí</b>.
            </Typography>}

          <div className={classes.itemsContainer}>
            {listaExperienciaLaboral.map((cardData) => {
              return <CardExperienciaLaboral
                cardData={cardData}
                handleEliminarExperienciaLaboral={this.eliminarExperienciaLaboral}
              />
            })}
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
  iconOcupacion: {
    fontSize: '22px',
    verticalAlign: 'middle',
    color: 'red',
    cursor: 'pointer',
  },
  textoOcupacion: {
    padding: '5px',
    borderTop: '1px solid #e0dede',
    borderBottom: '1px solid #e0dede',
    margin: '16px auto',
  }
});

let componente = DatosExperienciaLaboral;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
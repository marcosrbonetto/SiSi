import React from "react";
import { withRouter } from "react-router-dom";

import _ from "lodash";
import { push } from "connected-react-router";

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
import List from '@material-ui/core/List';
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
  },
  redireccionar: url => {
    dispatch(push(url));
  },
});

class DatosExperienciaLaboral extends React.PureComponent {
  constructor(props) {
    super(props);

    const listaExperienciaLaboral = props.loggedUser.datos.experienciasLaborales;

    this.state = {
      listaExperienciaLaboral: listaExperienciaLaboral && listaExperienciaLaboral.length > 0 && listaExperienciaLaboral || [],
      itemToEdit: null
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
      this.guardarExperienciaLaborales();
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
    }, () => {
      this.guardarExperienciaLaborales();
      console.log(this.state.listaExperienciaLaboral);
    });
  }

  handleChangeOcupacion = () => {
    window.location.href = window.Config.URL_MI_PERFIL + "/#/?token=" + this.props.loggedUser.token + '&seccion=datosExtra&seccionMensaje=Modifique su ocupación para mantener su perfil actualizado.&redirect=' + encodeURIComponent(window.Config.URL_ROOT + '/Inicio/ExperienciaLaboral');
  }

  volverInicio = () => {
    this.props.redireccionar("/Inicio");
  }

  editarExperienciaLaboral = (itemToEdit) => {
    this.setState({
      itemToEdit: itemToEdit
    });
  }

  render() {
    const { classes, loggedUser } = this.props;
    let { listaExperienciaLaboral, itemToEdit } = this.state;

    let tieneTrabajo = _.filter(listaExperienciaLaboral, (experienciaLaboral) => {
      return experienciaLaboral.fechaFinalizacion == '' || experienciaLaboral.fechaFinalizacion == null || experienciaLaboral.fechaFinalizacion == undefined;
    });
    const actualizarOcupacion = (!loggedUser.datos.ocupacionId || loggedUser.datos.ocupacionId == 31) && tieneTrabajo.length > 0;

    listaExperienciaLaboral = _.orderBy(listaExperienciaLaboral, ['fechaFinalizacion', 'fechaInicio'], ['desc', 'desc']);

    return (
      <React.Fragment>
        <MiCard
          informacionAlerta={'Cargá acá tu último trabajo formal o informal. Por ej.: Atención del público en Centro de Salud. Recordá que es obligatorio. Podes cargar mas de una actividad.'}
          seccionBotones={{
            align: 'space-between',
            content: <React.Fragment>
              <Button onClick={this.volverInicio} variant="outlined" color="primary" className={classes.button}>
                <Icon className={classNames(classes.iconoBotonAtras, classes.secondaryColor)}>arrow_back_ios</Icon>
                Atrás</Button>

              <FormExperienciaLaboral
                handleExperienciaLaboralAgregada={this.agregarExperienciaLaboral}
                itemToEdit={itemToEdit}
              />
            </React.Fragment>
          }}
        >

          {listaExperienciaLaboral.length == 0 && <MiInput
            tipoInput={'checkbox'}
            label={'No tengo experiencia laboral'}
            checked={true}
          />}

          {actualizarOcupacion &&
            <Typography variant="body2" className={classes.textoOcupacion}>
              <i className={classNames(classes.iconOcupacion, "material-icons")}>error</i> Segun sus experiencias laborales cargadas usted no se encuentra desocupado actualmente, actualice su ocupación de MuniOnline entrando <b style={{ cursor: 'pointer' }} onClick={this.handleChangeOcupacion}>aquí</b>.
            </Typography>}

          <div className={classes.itemsContainer}>
            <List className={classes.root}>
              {listaExperienciaLaboral.map((cardData, index) => {
                return <React.Fragment>
                  {index == 0 && <hr />}
                  <CardExperienciaLaboral
                    cardData={cardData}
                    handleEliminarExperienciaLaboral={this.eliminarExperienciaLaboral}
                    handleEditarExperienciaLaboral={this.editarExperienciaLaboral}
                  /><hr />
                </React.Fragment>
              })}
            </List>
          </div>

        </MiCard>
      </React.Fragment>
    );
  }
}

const styles = theme => ({
  root: {
    width: '100%'
  },
  itemsContainer: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  bottomContent: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  iconoBotonAtras: {
    fontSize: '16px',
  },
  iconoBoton: {
    fontSize: '20px',
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
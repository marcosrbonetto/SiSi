import React from "react";
import PropTypes from 'prop-types';
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
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import Button from "@material-ui/core/Button";
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockIcon from '@material-ui/icons/Lock';

//MisComponentes
import MiCard from "@Componentes/MiNewCard";
import MiTabla from "@Componentes/MiTabla";
import MiControledDialog from "@Componentes/MiControledDialog";
import MiSelect from "@Componentes/MiSelect";
import MiInput from "@Componentes/MiInput";

import Rules_Gestor from "@Rules/Rules_Gestor";
import { mostrarAlerta, mostrarMensaje, dateToString } from "@Utils/functions";

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

class Aulas extends React.PureComponent {
  constructor(props) {
    super(props);

    this.idCursoACerrar = null;
    this.idCursoAActivar = null;

    this.state = {
      programaFiltroSeleccionado: -1,
      arrayProgramas: [],
      cursoFiltroSeleccionado: -1,
      arrayCursos: [],
      // aulaFiltroSeleccionado: -1,
      // arrayAulas: [],
      rowList: [],
    };
  }

  componentWillMount() {
    //Cargamos los programas y los cursos
    this.cargarProgramasYCursos();
  }

  cargarProgramasYCursos = (callback) => {
    this.props.mostrarCargando(true);
    const token = this.props.loggedUser.token;

    Rules_Gestor.getProgramasYCursos(token)
      .then((datos) => {
        this.props.mostrarCargando(false);
        if (!datos.ok) {
          mostrarAlerta('Ocurrió un error al intentar obtener los programas y cursos.');
          return false;
        }

        if (datos.return == null || datos.return.length == 0) return false;

        let arrayProgramas = [];
        let arrayCursos = [];
        datos.return.map((programa) => {
          const itemPrograma = {
            label: programa.nombre,
            subLabel: programa.descripcion,
            value: programa.id
          };

          arrayProgramas.push(itemPrograma);

          if (programa.cursos != null && programa.cursos.length > 0) {
            programa.cursos.map((curso) => {
              const itemCurso = {
                idPrograma: curso.idPrograma,
                label: curso.nombre + (curso.lugar && curso.lugar != '' ? ' - ' + curso.lugar : ''),
                lugar: curso.lugar && curso.lugar != '' ? curso.lugar : '-',
                dia: curso.dia,
                horario: curso.horario,
                value: curso.id,
              };

              arrayCursos.push(itemCurso);
            });
          }
        });

        this.setState({
          arrayProgramas: arrayProgramas,
          arrayCursos: arrayCursos,
        });

        if (callback instanceof Function)
          callback();
      })
      .catch((error) => {
        mostrarAlerta('Ocurrió un error al intentar obtener los programas y cursos.');
        console.error('Error Servicio "Rules_Gestor.getProgramasYCursos": ' + error);
      });
  }

  handleSelectFiltroPrograma = (item) => {
    this.setState({
      programaFiltroSeleccionado: item.value,
      cursoFiltroSeleccionado: -1
    })
  }

  handleQuitarFiltroPrograma = () => {
    this.setState({
      programaFiltroSeleccionado: -1
    })
  }

  handleSelectFiltroCursos = (item) => {
    this.setState({
      cursoFiltroSeleccionado: item.value
    })
  }

  handleQuitarFiltroCursos = () => {
    this.setState({
      cursoFiltroSeleccionado: -1
    })
  }

  // handleSelectFiltroAulas = (item) => {
  //   this.setState({
  //     aulaFiltroSeleccionado: item.value
  //   })
  // }

  // handleQuitarFiltroAulas = () => {
  //   this.setState({
  //     aulaFiltroSeleccionado: -1
  //   })
  // }

  handleBuscar = () => {
    const idCurso = this.state.cursoFiltroSeleccionado;
    const idPrograma = this.state.programaFiltroSeleccionado;

    if (!idCurso || idCurso == -1 || !idPrograma || idPrograma == -1) {
      mostrarAlerta('Debe seleccionar un programa y un curso.');
      return false;
    }

    this.cargarPreinscriptos();
  }

  cargarPreinscriptos = () => {
    this.props.mostrarCargando(true);
    const token = this.props.loggedUser.token;

    let filters = {};

    if (this.state.programaFiltroSeleccionado != -1) {
      filters['idPrograma'] = this.state.programaFiltroSeleccionado;
    }

    if (this.state.cursoFiltroSeleccionado != -1) {
      filters['idCurso'] = this.state.cursoFiltroSeleccionado;
    }

    //Solo los no asignados a cursos
    filters['idAula'] = -1;

    Rules_Gestor.getPreinsciptos(token, filters).then((datos) => {
      this.props.mostrarCargando(false);
      if (!datos.ok) {
        mostrarAlerta('Ocurrió un error al intentar obtener los inscriptos.');
        return false;
      }

      let listaInscriptos = [];

      // {
      //   "idUsuario": 0,
      //   "nombre": "string",
      //   "apellido": "string",
      //   "cuit": "string",
      //   "email": "string",
      //   "fechaPreinscripcion": "2019-03-11T14:26:14.556Z",
      //   "tieneEmpresa": true,
      //   "nombreEmpresa": "string",
      //   "cuitEmpresa": "string",
      //   "domicilioEmpresa": "string",
      //   "descripcionEmpresa": "string",
      //   "filaDeEspera": true,
      //   "idCurso": 0,
      //   "idPrograma": 0
      // }

      datos.return.map((preinscripto) => {

        const idPrograma = parseInt(preinscripto.idPrograma);
        const programa = _.find(this.state.arrayProgramas, { value: idPrograma });

        const idCurso = parseInt(preinscripto.idCurso);
        const curso = _.find(this.state.arrayCursos, { value: idCurso });

        listaInscriptos.push({
          cuit: preinscripto.cuit,
          apellidoNombre: preinscripto.apellido + ', ' + preinscripto.nombre,
          email: preinscripto.email,
          filaDeEspera: preinscripto.filaDeEspera ? 'Si' : 'No',
          fechaPreinscripcion: preinscripto.fechaPreinscricion ? dateToString(new Date(preinscripto.fechaPreinscricion), 'DD/MM/YYYY') : '',
          // acciones: <React.Fragment>
          //   <Button onClick={this.onDialogOpenPreinscripcion} idUsuario={preinscripto.idUsuario} size="small" color="secondary" className={this.props.classes.iconoAceptar}>
          //     <i class="material-icons">edit</i>
          //   </Button>
          //   <Button title="Desinscribir" idCurso={preinscripto.idCurso} idUsuario={preinscripto.idUsuario} onClick={this.onDialogOpenCancelacion} size="small" color="secondary" className={this.props.classes.iconoEliminar}>
          //     <CloseIcon title="Desinscribir" />
          //   </Button>
          // </React.Fragment>,
          data: {
            idUsuario: preinscripto.idUsuario,
            idPrograma: preinscripto.idPrograma,
            idCurso: preinscripto.idCurso,
            email: preinscripto.email,
            apellido: preinscripto.apellido,
            nombre: preinscripto.nombre,
            cuit: preinscripto.cuit,
          }
        });

      });

      this.setState({
        rowList: listaInscriptos
      });

    })
      .catch((error) => {
        this.props.mostrarCargando(false);
        mostrarAlerta('Ocurrió un error al intentar obtener los inscriptos.');
        console.error('Error Servicio "Rules_Gestor.getPreinsciptos": ' + error);
      });
  }

  asignarAulas = () => {
    this.props.mostrarCargando(true);
    const token = this.props.loggedUser.token;

    this.setState({
      rowList: []
    }, () => {

      let filters = {};

      if (this.state.programaFiltroSeleccionado != -1) {
        filters['idPrograma'] = this.state.programaFiltroSeleccionado;
      }

      if (this.state.cursoFiltroSeleccionado != -1) {
        filters['idCurso'] = this.state.cursoFiltroSeleccionado;
      }

      Rules_Gestor.asignarAulas(token, filters).then((datos) => {
        this.props.mostrarCargando(false);
        if (!datos.ok) {
          mostrarAlerta('Ocurrió un error al intentar asignar las alulas.');
          return false;
        }

        this.cargarPreinscriptos();
      })
        .catch((error) => {
          this.props.mostrarCargando(false);
          this.cargarPreinscriptos();

          mostrarAlerta('Ocurrió un error al intentar asignar las alulas.');
          console.error('Error Servicio "Rules_Gestor.asignarAulas": ' + error);
        });
        
    });
  }

  render() {
    const { classes } = this.props;
    const {
      programaFiltroSeleccionado,
      cursoFiltroSeleccionado,
      // aulaFiltroSeleccionado,
      arrayProgramas,
      arrayCursos,
      // arrayAulas,
      rowList,
    } = this.state;

    var filterCursos = _.filter(arrayCursos, (o) => { return o.idPrograma == programaFiltroSeleccionado });

    return (
      <section className={classes.mainContainer}>
        <Grid container spacing={16} >
          <Grid item xs={12} sm={12}>
            <MiCard titulo="Filtros">

              <Grid container spacing={16}>
                <Grid item xs={12} sm={6}>
                  <Grid container>
                    <Grid item xs={12} sm={12} className={classes.centerItems}>
                      <MiSelect
                        onChange={this.handleSelectFiltroPrograma}
                        value={programaFiltroSeleccionado}
                        label="Programas"
                        fullWidth={true}
                        options={arrayProgramas} />
                      {programaFiltroSeleccionado != -1 && <Icon className={classes.limpiarSelect} onClick={this.handleQuitarFiltroPrograma}>clear</Icon>}
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Grid container>
                    <Grid item xs={12} sm={12} className={classes.centerItems}>
                      <MiSelect
                        onChange={this.handleSelectFiltroCursos}
                        value={cursoFiltroSeleccionado}
                        label="Cursos"
                        fullWidth={true}
                        options={filterCursos} />
                      {cursoFiltroSeleccionado != -1 && <Icon className={classes.limpiarSelect} onClick={this.handleQuitarFiltroCursos}>clear</Icon>}
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.buttonFilter}
                        onClick={this.handleBuscar}
                      >Buscar</Button>
                    </Grid>
                  </Grid>
                </Grid>

                {/* <Grid item xs={12} sm={6}>
                  <Grid container>
                    <Grid item xs={12} sm={12} className={classes.centerItems}>
                      <MiSelect
                        onChange={this.handleSelectFiltroAulas}
                        value={aulaFiltroSeleccionado}
                        label="Aulas"
                        fullWidth={true}
                        options={filterCursos} />
                      {aulaFiltroSeleccionado != -1 && <Icon className={classes.limpiarSelect} onClick={this.handleQuitarFiltroAulas}>clear</Icon>}
                    </Grid>
                  </Grid>
                </Grid> */}

              </Grid>

            </MiCard>
          </Grid>
        </Grid>

        <Grid container spacing={16}>
          <Grid item xs={12} sm={12}>
            <br />
            <MiCard titulo="Lista de Cursos">

              <div className={classes.buttonsAction}>
                <Button onClick={this.asignarAulas} color="primary" variant="outlined" >Asignar Aulas</Button>
                <Button color="primary" variant="outlined" >Decargar Excel</Button>
              </div>

              {/* Tabla de detalle del tributo */}
              <MiTabla
                pagination={true}
                classPaper={classes.contentTable}
                columns={[

                  { id: 'nombre', type: 'string', numeric: false, disablePadding: false, label: 'Apellido Nombre' },

                  { id: 'cuit', type: 'string', numeric: false, disablePadding: false, label: 'Nombre' },

                  { id: 'email', type: 'string', numeric: false, disablePadding: false, label: 'Nombre' },

                  { id: 'filaDeEspera', type: 'string', numeric: false, disablePadding: false, label: 'En Espera' },

                  { id: 'fechaPreinscripcion', type: 'string', numeric: false, disablePadding: false, label: 'Fecha Inscr.' },

                  // { id: 'acciones', type: 'custom', numeric: false, disablePadding: false, label: 'Acciones' },
                ]}
                rows={rowList || []}
                order={'asc'}
                orderBy={'apellido'}
                rowsPerPage={30}
              />
            </MiCard>
          </Grid>
        </Grid>

      </section>
    );
  }
}

let componente = Aulas;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
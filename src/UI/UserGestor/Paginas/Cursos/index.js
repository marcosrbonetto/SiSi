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
import DeleteIcon from '@material-ui/icons/Delete';

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

class Cursos extends React.PureComponent {
  constructor(props) {
    super(props);

    this.idUsuarioAEliminar = null;

    this.state = {
      programaFiltroSeleccionado: -1,
      arrayProgramas: [],
      cursoFiltroSeleccionado: -1,
      arrayCursos: [],
      valueInputNombre: '',
      valueInputLugar: '',
      rowList: []
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

        let arrayProgramas = []; //Dato fijo
        let arrayCursos = []; //Dato fijo
        let rowList = []; //Dato cambiante (cuando se aplican filtros)
        datos.return.map((programa) => {
          const itemPrograma = {
            label: programa.nombre,
            subLabel: programa.descripcion,
            value: programa.id
          };

          arrayProgramas.push(itemPrograma);

          if (programa.cursos != null && programa.cursos.length > 0) {
            programa.cursos.map((curso) => {

              let cantPreinscriptos = 0;
              let cantEnEspera = 0;
              if(curso.preinscripciones instanceof Array && curso.preinscripciones.length > 0){
                curso.preinscripciones.map((preinscripto) => {
                  if(preinscripto.filaDeEspera)
                    cantEnEspera++;
                  else
                    cantPreinscriptos++;
                });
              }

              const itemCurso = {
                nombre: curso.nombre,
                lugar: curso.lugar != '' ? curso.lugar : '',
                horario: (curso.dia && curso.dia + ' ' + curso.horario) || '',
                programa: programa.nombre,
                categoria: curso.tag,
                cupo: cantPreinscriptos + '/' + curso.cupo,
                listaEspera: cantEnEspera + '/' + curso.cupoListaDeEspera,
                acciones: <React.Fragment>
                  <Button idCurso={curso.id} onClick={this.onDialogOpenCerrarCurso} size="small" color="secondary" className={this.props.classes.iconoEliminar}>
                    <DeleteIcon />
                  </Button>
                </React.Fragment>,
                data: {
                  ...curso
                }
              };

              arrayCursos.push(itemCurso);
              rowList.push(itemCurso);
            });
          }
        });

        this.setState({
          arrayProgramas: arrayProgramas,
          arrayCursos: arrayCursos,
          rowList: rowList
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

  onDialogOpenCerrarCurso = (event) => {
    const idCurso = event.currentTarget.attributes.idCurso.value;
    if (!idCurso) return false;
    this.idCursoACerrar = idCurso;

    this.setState({
      dialogCerrarCurso: true
    })
  }

  onDialogCloseCerrarCurso = () => {
    this.idCursoAEliminar = null;

    this.setState({
      dialogCerrarCurso: false
    })
  }

  onChangeInputNombre = (value) => {
    this.setState({
      valueInputNombre: value
    })
  }

  onChangeInputLugar = (value) => {
    this.setState({
      valueInputLugar: value
    })
  }

  handleBuscarCursos = () => {
    const arrayCursos = this.state.arrayCursos;
    const rowList = _.filter(arrayCursos, (curso) => {
      const idPrograma = this.state.programaFiltroSeleccionado;
      const filtroNombre = this.state.valueInputNombre;
      const filtroLugar = this.state.valueInputLugar;

      if (idPrograma == -1 && filtroNombre == '' && filtroLugar == '') {
        return true;
      } else {
        return (idPrograma != -1 && curso.data.idPrograma == idPrograma) ||
          (filtroNombre != '' && curso.data.nombre && curso.data.nombre.toLowerCase().indexOf(filtroNombre.toLowerCase()) != -1) ||
          (filtroLugar != '' && curso.data.lugar && curso.data.lugar.toLowerCase().indexOf(filtroLugar.toLowerCase()) != -1);
      }
    });

    this.setState({
      rowList: rowList
    })
  }

  render() {
    const { classes } = this.props;
    const {
      programaFiltroSeleccionado,
      dialogCerrarCurso,
      arrayProgramas,
      arrayCursos,
      rowList,
      valueInputNombre,
      valueInputLugar
    } = this.state;

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
                    <Grid item xs={12} sm={12} className={classes.centerItems}>
                      <MiInput
                        id={'Nombre Curso'}
                        tipoInput={'input'}
                        type={'text'}
                        value={valueInputNombre}
                        error={false}
                        mensajeError={false}
                        label={'Buscar por Nombre del Curso'}
                        placeholder={'Ingrese el Nombre del Curso...'}
                        onChange={this.onChangeInputNombre}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Grid container>
                    <Grid item xs={12} sm={12} className={classes.centerItems}>
                      <MiInput
                        id={'Lugar Curso'}
                        tipoInput={'input'}
                        type={'text'}
                        value={valueInputLugar}
                        error={false}
                        mensajeError={false}
                        label={'Buscar por Lugar del Curso'}
                        placeholder={'Ingrese el Lugar del Curso...'}
                        onChange={this.onChangeInputLugar}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} className={classes.centerItems}>
                      <section className={classes.containerBotonera}>
                        <Button
                          variant="contained"
                          color="primary"
                          className={classes.buttonActions}
                          onClick={this.handleBuscarCursos}
                        >Aplicar Filtros</Button>
                      </section>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

            </MiCard>
          </Grid>
        </Grid>

        <Grid container spacing={16}>
          <Grid item xs={12} sm={12}>
            <br />
            <MiCard titulo="Lista de Cursos">
              {/* Tabla de detalle del tributo */}
              <MiTabla
                pagination={true}
                classPaper={classes.contentTable}
                columns={[

                  { id: 'nombre', type: 'string', numeric: false, disablePadding: false, label: 'Nombre' },

                  { id: 'lugar', type: 'string', numeric: false, disablePadding: false, label: 'Lugar' },

                  { id: 'horario', type: 'string', numeric: false, disablePadding: false, label: 'Horario' },

                  { id: 'programa', type: 'string', numeric: false, disablePadding: false, label: 'Programa' },

                  { id: 'categoria', type: 'string', numeric: false, disablePadding: false, label: 'Categoria' },

                  { id: 'cupo', type: 'string', numeric: false, disablePadding: false, label: 'Cupo' },

                  { id: 'listaEspera', type: 'string', numeric: false, disablePadding: false, label: 'Lista Espera' },

                  { id: 'acciones', type: 'custom', numeric: false, disablePadding: false, label: 'Acciones' },
                ]}
                rows={rowList || []}
                order={'asc'}
                orderBy={'apellido'}
                rowsPerPage={5}
              />
            </MiCard>
          </Grid>
        </Grid>

        <MiControledDialog
          open={dialogCerrarCurso}
          onDialogoOpen={this.onDialogOpenCerrarCurso}
          onDialogoClose={this.onDialogCloseCerrarCurso}
          buttonOptions={{
            onDialogoAccept: this.cierreCursoAceptado,
            onDialogoCancel: this.cierreCursoCancelado,
          }}
          titulo={'Cierre de curso'}
        >
          ¿Esta segura que desea cerrar el curso seleccionado?
        </MiControledDialog>
      </section>
    );
  }
}

let componente = Cursos;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
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
import CancelIcon from '@material-ui/icons/Cancel';

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

class Programas extends React.PureComponent {
  constructor(props) {
    super(props);

    this.idUsuarioAEliminar = null;

    this.state = {
      programaFiltroSeleccionado: -1,
      arrayProgramas: [],
      valueInputNombre: '',
      rowList: []
    };
  }

  componentWillMount() {
    //Cargamos los programas y los cursos
    this.cargarProgramas();
  }

  cargarProgramas = (callback) => {
    this.props.mostrarCargando(true);
    const token = this.props.loggedUser.token;

    Rules_Gestor.getProgramasYCursos(token)
      .then((datos) => {
        debugger;
        this.props.mostrarCargando(false);
        if (!datos.ok) {
          mostrarAlerta('Ocurrió un error al intentar obtener los programas.');
          return false;
        }

        if (datos.return == null || datos.return.length == 0) return false;

        let arrayProgramas = []; //Dato fijo
        let rowList = []; //Dato cambiante (cuando se aplican filtros)
        datos.return.map((programa) => {

          const itemPrograma = {
            nombre: programa.nombre,
            descripcion: programa.descripcion != '' ? programa.descripcion : '',
            acciones: <React.Fragment>
              <Button idPrograma={programa.id} onClick={this.onDialogOpenCerrarPrograma} size="small" color="secondary" className={this.props.classes.iconoEliminar}>
                <CancelIcon />
              </Button>
            </React.Fragment>,
            data: {
              ...programa
            }
          };

          arrayProgramas.push(itemPrograma);
          rowList.push(itemPrograma);
        });

        this.setState({
          arrayProgramas: arrayProgramas,
          rowList: rowList
        });

        if (callback instanceof Function)
          callback();
      })
      .catch((error) => {
        mostrarAlerta('Ocurrió un error al intentar obtener los programas.');
        console.error('Error Servicio "Rules_Gestor.getProgramasYCursos": ' + error);
      });
  }

  onDialogOpenCerrarPrograma = (event) => {
    const idPrograma = event.currentTarget.attributes.idPrograma.value;
    if (!idPrograma) return false;
    this.idProgramaACerrar = idPrograma;

    this.setState({
      dialogCerrarPrograma: true
    })
  }

  onDialogCloseCerrarPrograma = () => {
    this.idProgramaAEliminar = null;

    this.setState({
      dialogCerrarPrograma: false
    })
  }

  onChangeInputNombre = (value) => {
    this.setState({
      valueInputNombre: value
    })
  }

  handleBuscarProgramas = () => {
    const arrayProgramas = this.state.arrayProgramas;
    const rowList = _.filter(arrayProgramas, (programa) => {
      const filtroNombre = this.state.valueInputNombre;

      if (filtroNombre == '') {
        return true;
      } else {
        return filtroNombre != '' && programa.data.nombre && programa.data.nombre.toLowerCase().indexOf(filtroNombre.toLowerCase()) != -1;
      }
    });

    this.setState({
      rowList: rowList
    })
  }

  render() {
    const { classes } = this.props;
    const {
      dialogCerrarPrograma,
      rowList,
      valueInputNombre,
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
                      <MiInput
                        id={'Nombre Programa'}
                        tipoInput={'input'}
                        type={'text'}
                        value={valueInputNombre}
                        error={false}
                        mensajeError={false}
                        label={'Buscar por Nombre del Programa'}
                        placeholder={'Ingrese el Nombre del Programa...'}
                        onChange={this.onChangeInputNombre}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Grid container>
                    <Grid item xs={12} sm={12} className={classes.centerItems}>
                      <section className={classes.containerBotonera}>
                        <Button
                          variant="contained"
                          color="primary"
                          className={classes.buttonActions}
                          onClick={this.handleBuscarProgramas}
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
            <MiCard titulo="Lista de Programas">
              {/* Tabla de detalle del tributo */}
              <MiTabla
                pagination={true}
                classPaper={classes.contentTable}
                columns={[

                  { id: 'nombre', type: 'string', numeric: false, disablePadding: false, label: 'Nombre' },

                  { id: 'descripcion', type: 'string', numeric: false, disablePadding: false, label: 'Descripción' },

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
          open={dialogCerrarPrograma}
          onDialogoOpen={this.onDialogOpenCerrarPrograma}
          onDialogoClose={this.onDialogCloseCerrarPrograma}
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

let componente = Programas;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
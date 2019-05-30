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
import EmailIcon from '@material-ui/icons/Email';
import TextField from '@material-ui/core/TextField';

//MisComponentes
import MiCard from "@Componentes/MiNewCard";
import MiTabla from "@Componentes/MiTabla";
import MiControledDialog from "@Componentes/MiControledDialog";
import MiSelect from "@Componentes/MiSelect";
import MiInput from "@Componentes/MiInput";

import Rules_Gestor from "@Rules/Rules_Gestor";
import Rules_Programas from "@Rules/Rules_Programas";
import { mostrarAlerta, mostrarMensaje, dateToString } from "@Utils/functions";

import FormPrograma from "@ComponentesProgramasGestor/FormPrograma.js";

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

    this.idProgramaAExportarExcel = null;
    
    this.state = {
      dialogModificarPrograma: false,
      arrayProgramas: [],
      valueInputNombre: '',
      rowList: [],
      inputEmail: this.props.loggedUser.datos.email,
      errorInputEmail: false
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
            descripcion: programa.descripcion != '' ? <div style={{overflow: 'hidden', maxHeight: '38px'}}>{programa.descripcion}</div> : '',
            acciones: <div className={this.props.classes.iconContainer}>
              <Button title="Enviar Excel" idPrograma={programa.id} onClick={this.onDialogOpenExportarExcelPrograma} size="small" color="secondary" className={classNames(this.props.classes.icono, this.props.classes.iconoExportar)}>
                <EmailIcon />
              </Button>
              <Button title="Modificar" idPrograma={programa.id} onClick={this.onDialogOpenModificarPrograma} size="small" color="secondary" className={classNames(this.props.classes.icono, this.props.classes.iconoModificar)}>
                <i class="material-icons">edit</i>
              </Button>
            </div>,
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

  onDialogOpenExportarExcelPrograma = (event) => {
    const idPrograma = event.currentTarget.attributes.idPrograma.value;
    if (!idPrograma) return false;
    this.idProgramaAExportarExcel = idPrograma;

    this.setState({
      dialogExportarExcelPrograma: true
    })
  }

  onDialogCloseExportarExcelPrograma = () => {
    this.idProgramaAExportarExcel = null;

    this.setState({
      dialogExportarExcelPrograma: false
    })
  }

  onDialogOpenModificarPrograma = (event) => {
    const idPrograma = event.currentTarget.attributes.idPrograma.value;
    if (!idPrograma) return false;
    this.idProgramaAModificar = idPrograma;
    
    const programa = this.state.arrayProgramas.find((o) => {
      return o.data.id == idPrograma;
    });
    this.programaAModificar = programa || null;

    this.setState({
      dialogModificarPrograma: true
    })
  }

  onDialogCloseModificarPrograma = () => {

    this.setState({
      dialogModificarPrograma: false
    }, () => {
      this.idProgramaAModificar = null;
      this.programaAModificar = null;
    });
  }

  onSubmitModificarPrograma = (programaValues) => {
    const token = this.props.loggedUser.token;
    
    Rules_Programas.updatePrograma(token, programaValues)
      .then((datos) => {
        if (!datos.ok) {
          mostrarAlerta(datos.error);
          return false;
        }

        this.cargarProgramas();
        mostrarMensaje('Programa modificado exitosamente!');
        this.onDialogCloseModificarPrograma();
      })
      .catch((error) => {
        mostrarAlerta('Ocurrió un error al intentar modificar el programa.');
        console.error('Error Servicio "Rules_Programas.updatePrograma": ' + error);
      });
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

  handleInputEmailOnCange = (event) => {
    this.setState({
      inputEmail: event.target.value
    });
  }

  handleCursoCancelado = () => {
    this.setState({
      dialogExportarExcelPrograma: false,
      inputEmail: this.props.loggedUser.datos.email,
      errorInputEmail: false
    })
  }

  handleCursoAceptado = () => {
    if (this.state.inputEmail == '' || (this.state.inputEmail != '' && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.state.inputEmail))) {
      this.setState({
        errorInputEmail: true
      });
      return false;
    }
    
    this.props.mostrarCargando(true);

    const idPrograma = this.idProgramaAExportarExcel;
    this.idProgramaAExportarExcel = null;

    const email = this.state.inputEmail;

    this.setState({
      dialogExportarExcelPrograma: false,
      inputEmail: this.props.loggedUser.datos.email,
      errorInputEmail: false,
    }, () => {
      const token = this.props.loggedUser.token;
      Rules_Gestor.exportarPreinscriptos(token, {
        "email": email,
        "idPrograma": idPrograma
      }).then((datos) => {
        this.props.mostrarCargando(false);
        if (!datos.ok) {
          mostrarAlerta(datos.error);
          return false;
        }

        if (datos.return)
          mostrarMensaje('Correo enviado con éxito al correo: ' + email);
        else
          mostrarAlerta('Ocurrió un error al intentar enviar el excel.');

      })
        .catch((error) => {
          this.props.mostrarCargando(true);
          mostrarAlerta('Ocurrió un error al intentar enviar el excel.');
          console.error('Error Servicio "Rules_Gestor.getProgramasYCursos": ' + error);
        });
    });
  }

  render() {
    const { classes } = this.props;
    const {
      dialogModificarPrograma,
      dialogExportarExcelPrograma,
      rowList,
      valueInputNombre,
      inputEmail,
      errorInputEmail
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
          open={dialogExportarExcelPrograma}
          onDialogoOpen={this.onDialogOpenExportarExcelPrograma}
          onDialogoClose={this.onDialogCloseExportarExcelPrograma}
          buttonOptions={{
            onDialogoAccept: this.handleCursoAceptado,
            onDialogoCancel: this.handleCursoCancelado,
          }}
          titulo={'Envío Excel por correo'}
          classMaxWidth={classes.dialogWidth}
        >
          

          <TextField
            error={errorInputEmail}
            type={'text'}
            label={'Ingrese el correo al que se le enviará el excel:'}
            value={inputEmail}
            margin="none"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={this.handleInputEmailOnCange}
            helperText={errorInputEmail && 'Email erroneo'}
            className={classes.inputWidth}
          />
        </MiControledDialog>








        <MiControledDialog
          open={dialogModificarPrograma}
          onDialogoOpen={this.onDialogOpenModificarPrograma}
          onDialogoClose={this.onDialogCloseModificarPrograma}
          titulo={'Modificación de Programa'}
          classMaxWidth={classes.dialogExpand}
        >
          <FormPrograma programa={this.programaAModificar} onSubmit={this.onSubmitModificarPrograma} />
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
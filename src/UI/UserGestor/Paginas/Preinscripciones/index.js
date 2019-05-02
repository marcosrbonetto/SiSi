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
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

//MisComponentes
import MiCard from "@Componentes/MiNewCard";
import MiTabla from "@Componentes/MiTabla";
import MiControledDialog from "@Componentes/MiControledDialog";
import MiSelect from "@Componentes/MiSelect";
import MiInput from "@Componentes/MiInput";
import { onInputChangeValidateForm, onInputFocusOutValidateForm, validateForm } from "@Componentes/MiInput";

//Reporte
import ReportePDF from '@ComponentesPreinscripciones/ReportePDF';

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

class Home extends React.PureComponent {
  constructor(props) {
    super(props);

    this.idUsuarioAEliminar = null;
    this.idCursoUsuarioAEliminar = null;

    this.idUsuarioAPreinscribir = null;

    this.state = {
      programaFiltroSeleccionado: -1,
      programaFiltroSeleccionadoPreinscripcion: -1,
      arrayProgramas: [],
      cursoFiltroSeleccionado: -1,
      cursoFiltroSeleccionadoPreinscripcion: -1,
      arrayCursos: [],
      aulaFiltroSeleccionado: -1,
      arrayAulas: [],
      valueInputCUIT: '',
      valueInputNombre: '',
      valueInputLugar: '',
      rowList: [],
      dialogConfirmacion: false,
      dialogCancelacion: false,
      dialogPreinscripcion: false,
      dialogImpresionReporte: false,
      arrayReporte: [],
      checkEmpresa: 'noEmpresa',
      formInputsEmpresa: [
        {
          id: 'InputNombreEmpresa',
          value: '',
          initValue: '',
          valiateCondition: /^.{0,50}$/,
          error: false,
          required: true,
          mensajeError: 'Este campo es obligatorio y tiene un límite de 50 catacteres.'
        },
        {
          id: 'InputDescripcionEmpresa',
          value: '',
          initValue: '',
          valiateCondition: /^.{0,150}$/,
          error: false,
          required: true,
          mensajeError: 'Este campo es obligatorio y tiene un límite de 150 catacteres.'
        },
        {
          id: 'InputCuitEmpresa',
          value: '',
          initValue: '',
          valiateCondition: /^[0-9]{11}$/,
          error: false,
          required: false,
          mensajeError: 'Este campo es opcional y debe contener 11 números.'
        },
        {
          id: 'InputContactoEmpresa',
          value: '',
          initValue: '',
          valiateCondition: /^.{0,20}$/,
          error: false,
          required: true,
          mensajeError: 'Este campo es obligatorio y tiene un límite de 150 catacteres.'
        },
      ],
      cursoSeleccionado: undefined,
      valueEmailExcel: '',
      dialogoOpenEmailExcel: false,
      dialogoOpenHabilitarAulaVirtual: false,
    };
  }

  componentWillMount() {
    //Cargamos primero los programas y cursos para luego poder mostrar correctamente los correspondinetes a cada preinscripcion
    this.cargarProgramasCursos(() => {
      //Luego procedemos a cargar las preinscipciones
      this.cargarPreinscriptos();
    });
  }

  cargarProgramasCursos = (callback) => {
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
            value: programa.id,
            esVirtual: programa.esVirtual
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
                data: {
                  ...curso,
                  idPrograma: curso.idPrograma,
                  programa: programa.nombre,
                  idCurso: curso.id,
                  curso: curso.nombre + (curso.lugar && curso.lugar != '' ? ' - ' + curso.lugar : ''),
                  lugar: curso.lugar && curso.lugar != '' ? curso.lugar : '-',
                  horario: curso ? (curso.dia && curso.dia != '' ? curso.dia + ' ' + curso.horario : '-') : '-',
                }
              };

              arrayCursos.push(itemCurso);
            });
          }
        });

        this.setState({
          arrayProgramas: arrayProgramas,
          arrayCursos: arrayCursos
        });

        if (callback instanceof Function)
          callback();
      })
      .catch((error) => {
        mostrarAlerta('Ocurrió un error al intentar obtener los programas y cursos.');
        console.error('Error Servicio "Rules_Gestor.getProgramasYCursos": ' + error);
      });
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

    if (this.state.aulaFiltroSeleccionado != -1) {
      filters['aula'] = this.state.aulaFiltroSeleccionado;
    }

    if (this.state.valueInputNombre != '') {
      filters['nombre'] = this.state.valueInputNombre;
    }

    if (this.state.valueInputCUIT != '') {
      filters['cuit'] = this.state.valueInputCUIT;
    }

    if (this.state.valueInputLugar != '') {
      filters['lugar'] = this.state.valueInputLugar;
    }

    Rules_Gestor.getPreinsciptos(token, filters).then((datos) => {
      this.props.mostrarCargando(false);
      if (!datos.ok) {
        mostrarAlerta('Ocurrió un error al intentar obtener los preinscriptos.');
        return false;
      }

      let listaPreinscriptos = [];

      // {
      //   "idUsuario": 0,
      //   "nombre": "string",
      //   "apellido": "string",
      //   "cuit": "string",
      //   "email": "string",
      //   "fechaPreinscricion": "2019-03-11T14:26:14.556Z",
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

        listaPreinscriptos.push({
          cuit: preinscripto.cuit,
          apellidoNombre: preinscripto.apellido + ', ' + preinscripto.nombre,
          programa: programa ? programa.label : '-',
          curso: curso ? curso.label : '-',
          aula: preinscripto && preinscripto.aula ? 'Aula N°' + preinscripto.aula : 'Sin Asig.',
          fechaPreinscricion: preinscripto.fechaPreinscricion ? dateToString(new Date(preinscripto.fechaPreinscricion), 'DD/MM/YYYY') : '',
          acceso: preinscripto && preinscripto.habilitada ? preinscripto.habilitada : 'No',
          codigo: preinscripto && preinscripto.codigo ? preinscripto.codigo : '-',
          acciones: <React.Fragment>
            <Button onClick={this.onDialogOpenPreinscripcion} idUsuario={preinscripto.idUsuario} size="small" color="secondary" className={this.props.classes.iconoAceptar}>
              <i class="material-icons">edit</i>
            </Button>
            <Button title="Desinscribir" idCurso={preinscripto.idCurso} idUsuario={preinscripto.idUsuario} onClick={this.onDialogOpenCancelacion} size="small" color="secondary" className={this.props.classes.iconoEliminar}>
              <CloseIcon title="Desinscribir" />
            </Button>
          </React.Fragment>,
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
        rowList: listaPreinscriptos
      });
    })
      .catch((error) => {
        mostrarAlerta('Ocurrió un error al intentar obtener los preinscriptos.');
        console.error('Error Servicio "Rules_Gestor.getPreinsciptos": ' + error);
      });

  }

  handleSelectFiltroPrograma = (item) => {
    this.setState({
      programaFiltroSeleccionado: item.value,
      cursoFiltroSeleccionado: -1,
      arrayAulas: [],
      rowList: [],
      aulaFiltroSeleccionado: -1
    })
  }

  handleQuitarFiltroPrograma = () => {
    this.setState({
      programaFiltroSeleccionado: -1,
      arrayAulas: [],
      aulaFiltroSeleccionado: -1
    })
  }

  handleSelectFiltroCursos = (item) => {
    this.setState({
      cursoFiltroSeleccionado: item.value,
      arrayAulas: [],
      rowList: [],
      aulaFiltroSeleccionado: -1
    }, () => {
      if (item.value && item.value != -1) {
        const token = this.props.loggedUser.token;
        const idCurso = item.value;

        Rules_Gestor.getAulas(token, idCurso).then((datos) => {
          this.props.mostrarCargando(false);
          if (!datos.ok) {
            mostrarAlerta('Ocurrió un error al intentar obtener las aulas del curso seleccionado.');
            return false;
          }

          if (datos.return == null || datos.return.length == 0) return false;

          let arrayAulas = [];
          datos.return.map((idAula) => {
            arrayAulas.push({
              value: idAula,
              label: "Aula N°" + idAula
            });
          });

          this.setState({
            arrayAulas: arrayAulas
          });

        })
          .catch((error) => {
            this.props.mostrarCargando(false);

            mostrarAlerta('Ocurrió un error al intentar obtener las aulas del curso seleccionado.');
            console.error('Error Servicio "Rules_Gestor.getAulas": ' + error);
          });

      }
    })
  }

  handleQuitarFiltroCursos = () => {
    this.setState({
      cursoFiltroSeleccionado: -1,
      arrayAulas: [],
      aulaFiltroSeleccionado: -1
    })
  }

  handleSelectFiltroAulas = (item) => {
    this.setState({
      aulaFiltroSeleccionado: item.value,
    })
  }

  handleQuitarFiltroAulas = () => {
    this.setState({
      aulaFiltroSeleccionado: -1
    })
  }

  onDialogOpenConfirmacion = () => {
    this.setState({
      dialogConfirmacion: true
    })
  }

  onDialogCloseConfirmacion = () => {
    this.setState({
      dialogConfirmacion: false
    })
  }

  onDialogOpenCancelacion = (event) => {
    const idUsuario = event.currentTarget.attributes.idUsuario.value;
    const idCurso = event.currentTarget.attributes.idCurso.value;

    if (!idUsuario || !idCurso) return false;

    this.idUsuarioAEliminar = idUsuario;
    this.idCursoUsuarioAEliminar = idCurso;

    this.setState({
      dialogCancelacion: true
    })
  }

  onDialogCloseCancelacion = () => {
    this.idUsuarioAEliminar = null;
    this.idCursoUsuarioAEliminar = null;

    this.setState({
      dialogCancelacion: false
    })
  }

  desinscripcionAceptada = () => {
    if (!this.idUsuarioAEliminar || !this.idCursoUsuarioAEliminar) return false;

    const idUsuario = this.idUsuarioAEliminar;
    const idCurso = this.idCursoUsuarioAEliminar;

    this.onDialogCloseCancelacion();

    this.props.mostrarCargando(true);
    const token = this.props.loggedUser.token;

    Rules_Gestor.deletePreinscripcion(token, {
      idUsuario: idUsuario,
      idCurso: idCurso,
    })
      .then((datos) => {

        if (!datos.ok) {
          this.props.mostrarCargando(false);
          mostrarAlerta('Ocurrió un error al intentar desinscribir al usuario.');
          return false;
        }

        let rowList = _.cloneDeep(this.state.rowList);
        _.remove(rowList, function (item) {
          return item.data.idUsuario == idUsuario;
        });

        this.setState({
          rowList: rowList
        })

        this.props.mostrarCargando(false);
        mostrarMensaje('Se ha desinscripto al usuario exitosamente!');
      })
      .catch((error) => {
        this.props.mostrarCargando(false);
        mostrarAlerta('Ocurrió un error al intentar desinscribir al usuario.');
        console.error('Error Servicio "Rules_Gestor.deletePreinscripcion": ' + error);
      });
  }

  onDialogOpenImpresionReporte = () => {

    const rowList = this.state.rowList;

    //Generamos array para generar reporte
    let arrayReporte = [];

    //Dividimos por grupos de preinscriptos de programas
    const preinscriptosPrograma = _.groupBy(rowList, (o) => { return o.data.idPrograma });

    if (preinscriptosPrograma) {
      Object.keys(preinscriptosPrograma).map((idPrograma) => {
        //preinscriptosPrograma[idPrograma] =  Array Inscriptios por programa

        //Dividimos por grupos de preinscriptos de cursos
        if (!isNaN(idPrograma) && preinscriptosPrograma[idPrograma].length > 0) {
          const preinscriptosCurso = _.groupBy(preinscriptosPrograma[idPrograma], (o) => { return o.data.idCurso });

          let grupo = {
            idPrograma: idPrograma,
            cursos: []
          };

          Object.keys(preinscriptosCurso).map((idCurso) => {
            //preinscriptosCurso[idCurso] =  Inscriptios por curso

            if (!isNaN(idCurso) && preinscriptosCurso[idCurso].length > 0) {
              //Creamos grupo para imprimir en reporte

              let curso = {
                idCurso: idCurso,
                preinscriptos: preinscriptosCurso[idCurso]
              };

              grupo.cursos.push(curso);
            }
          });

          arrayReporte.push(grupo);

        }
      });
    }

    this.setState({
      dialogImpresionReporte: true,
      arrayReporte: arrayReporte
    })
  }

  onDialogCloseImpresionReporte = () => {
    this.setState({
      dialogImpresionReporte: false,
      arrayReporte: []
    })
  }

  onChangeInputEmailExcel = (value) => {
    this.setState({
      valueEmailExcel: value
    })
  }

  onChangeInputCUIT = (value) => {
    this.setState({
      valueInputCUIT: value
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

  handleBuscarPreinscriptos = () => {
    this.cargarPreinscriptos();
  }


  onDialogOpenPreinscripcion = (event) => {
    const idUsuario = event.currentTarget.attributes.idUsuario.value;
    if (!idUsuario) return false;
    this.idUsuarioAPreinscribir = idUsuario;

    this.setState({
      dialogPreinscripcion: true
    })
  }

  onDialogClosePreinscripcion = () => {
    this.idUsuarioAPreinscribir = null;

    this.setState({
      dialogPreinscripcion: false
    })
  }

  onDialogoOpenEmailExcel = () => {
    this.setState({
      dialogoOpenEmailExcel: true
    })
  }

  onDialogoCloseEmailExcel = () => {
    this.setState({
      dialogoOpenEmailExcel: false
    })
  }

  onDialogoOpenHabilitarAulaVirtual = () => {
    this.setState({
      dialogoOpenHabilitarAulaVirtual: true
    })
  }

  onDialogoCloseHabilitarAulaVirtual = () => {
    this.setState({
      dialogoOpenHabilitarAulaVirtual: false
    })
  }

  handleChangeCheckEmpresa = (event) => {
    this.setState({ checkEmpresa: event.target.value });
  }

  handleSelectFiltroProgramaPreinscripcion = (item) => {
    this.setState({
      programaFiltroSeleccionadoPreinscripcion: item.value,
      cursoFiltroSeleccionadoPreinscripcion: -1,
      cursoSeleccionado: undefined
    })
  }

  handleQuitarFiltroProgramaPreinscripcion = () => {
    this.setState({
      programaFiltroSeleccionadoPreinscripcion: -1,
      cursoFiltroSeleccionadoPreinscripcion: -1,
      cursoSeleccionado: undefined
    })
  }

  handleSelectFiltroCursosPreinscripcion = (item) => {
    const cursoSeleccionado = _.find(this.state.arrayCursos, (o) => o.data.id == item.value);

    this.setState({
      cursoFiltroSeleccionadoPreinscripcion: item.value,
      cursoSeleccionado: cursoSeleccionado.data
    })
  }

  handleQuitarFiltroCursosPreinscripcion = () => {
    this.setState({
      cursoFiltroSeleccionadoPreinscripcion: -1,
      cursoSeleccionado: undefined
    })
  }

  onChangeInput = (value, type, input, props) => {

    const newformInputs = onInputChangeValidateForm(this.state.formInputsEmpresa, { value, type, input, props });

    this.setState({
      formInputsEmpresa: newformInputs
    });
  }

  onFocusOutInput = (input, props) => {

    const newformInputs = onInputFocusOutValidateForm(this.state.formInputsEmpresa, { input, props });

    this.setState({
      formInputsEmpresa: newformInputs
    });
  }

  validateForm = () => {

    const resultValidation = validateForm(this.state.formInputsEmpresa);

    this.setState({
      formInputsEmpresa: resultValidation.formInputs
    });

    return resultValidation.formHayError;
  }

  preinscripcionAceptada = () => {
    this.props.mostrarCargando(true);

    if (this.state.programaFiltroSeleccionadoPreinscripcion == -1 ||
      this.state.cursoFiltroSeleccionadoPreinscripcion == -1) {
      mostrarAlerta('Debe seleccionar un programa y un curso.');
      return false;
    }

    if (!this.idUsuarioAPreinscribir || !this.state.cursoSeleccionado) return false;

    const idUsuario = this.idUsuarioAPreinscribir;
    this.idUsuarioAPreinscribir = null;

    let rowList = _.cloneDeep(this.state.rowList);
    const usuario = _.find(rowList, (o) => o.data.idUsuario == idUsuario);
    const curso = this.state.cursoSeleccionado;

    if (!usuario) return false;

    let body = {
      "idCurso": curso.id,
      "tieneEmpresa": false,
      "nombreEmpresa": "",
      "cuitEmpresa": "",
      "domicilioEmpresa": "",
      "descripcionEmpresa": "",
      "idUsuario": idUsuario,
      "nombre": usuario.data.nombre,
      "apellido": usuario.data.apellido,
      "cuit": usuario.data.cuit,
      "email": usuario.data.email,
      "telefono": (usuario.data.telefonoCelular != '' ? usuario.data.telefonoCelular : usuario.data.telefonoFijo) || '',
    };

    if (curso &&
      curso.necesitaEmpresa &&
      this.state.checkEmpresa == 'siEmpresa') {

      const formHayError = this.validateForm();

      if (formHayError) {
        mostrarAlerta('Se han encontrado campos erroneos.');
        this.props.mostrarCargando(false);
        return false;
      }

      const formInputsEmpresa = this.state.formInputsEmpresa;

      const InputNombreEmpresa = _.find(formInputsEmpresa, { id: 'InputNombreEmpresa' });
      const InputDescripcionEmpresa = _.find(formInputsEmpresa, { id: 'InputDescripcionEmpresa' });
      const InputCuitEmpresa = _.find(formInputsEmpresa, { id: 'InputCuitEmpresa' });
      const InputContactoEmpresa = _.find(formInputsEmpresa, { id: 'InputContactoEmpresa' });

      body = {
        "idCurso": curso.id,
        "tieneEmpresa": true,
        "nombreEmpresa": InputNombreEmpresa.value || '',
        "cuitEmpresa": InputCuitEmpresa.value || '',
        "domicilioEmpresa": InputContactoEmpresa.value || '',
        "descripcionEmpresa": InputDescripcionEmpresa.value || '',
        "idUsuario": idUsuario,
        "nombre": usuario.data.nombre,
        "apellido": usuario.data.apellido,
        "cuit": usuario.data.cuit,
        "email": usuario.data.email,
        "telefono": (usuario.data.telefonoCelular != '' ? usuario.data.telefonoCelular : usuario.data.telefonoFijo) || '',
      };
    }

    this.onDialogClosePreinscripcion();

    const token = this.props.loggedUser.token;
    Rules_Gestor.reInscribir(token, body)
      .then((datos) => {
        this.props.mostrarCargando(false);
        if (!datos.ok) {
          this.setState({
            cursoSeleccionado: undefined,
            programaFiltroSeleccionadoPreinscripcion: -1,
            cursoFiltroSeleccionadoPreinscripcion: -1,
          });
          mostrarAlerta(datos.error);
          return false;
        }

        usuario.programa = curso.programa;
        usuario.curso = curso.curso;
        usuario.lugar = curso.lugar;
        usuario.horario = curso.horario;

        usuario.data = {
          ...usuario.data,
          idPrograma: curso.idPrograma,
          idCurso: curso.idCurso,
        };

        this.setState({
          cursoSeleccionado: undefined,
          programaFiltroSeleccionadoPreinscripcion: -1,
          cursoFiltroSeleccionadoPreinscripcion: -1,
          rowList: rowList
        });

        mostrarMensaje('Preinscripción actualizada exitosamente.');

      })
      .catch((error) => {
        this.props.mostrarCargando(false);
        this.setState({
          cursoSeleccionado: undefined,
          programaFiltroSeleccionadoPreinscripcion: -1,
          cursoFiltroSeleccionadoPreinscripcion: -1,
        });
        mostrarAlerta('Ocurrió un error al intentar preinscribir al usuario.');
        console.error('Error Servicio "Rules_Gestor.reInscribir": ' + error);
      });
  }

  exportarInscripcionesProgramaAExcel = () => {
    const habilitarExcelAccesoAulaVirtual = this.state.programaFiltroSeleccionado != -1 && this.state.cursoFiltroSeleccionado != -1 && _.find(this.state.arrayProgramas, (o) => { return o.value == this.state.programaFiltroSeleccionado && o.esVirtual == true });

    if (!habilitarExcelAccesoAulaVirtual) {
      mostrarAlerta('Para exportar el txt debe seleccionar un curso virtual.');
      return false;
    }

    const idCurso = this.state.cursoFiltroSeleccionado;
    const email = this.state.valueEmailExcel;

    if (!/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(email)) {
      mostrarAlerta('El email ingresado no es correcto.');
      return false;
    }

    this.props.mostrarCargando(true);
    const token = this.props.loggedUser.token;

    this.props.mostrarCargando(false);

    this.setState({
      valueEmailExcel: '',
      dialogoOpenEmailExcel: false
    }, () => {
      Rules_Gestor.exportarInscripcionesProgramaAExcel(token, {
        idCurso: idCurso,
        email: email
      })
        .then((datos) => {

          if (!datos.ok) {
            this.props.mostrarCargando(false);
            mostrarAlerta(datos.error);
            return false;
          }

          this.props.mostrarCargando(false);
          mostrarMensaje('Excel enviado al correo exitosamente!');
        })
        .catch((error) => {
          this.props.mostrarCargando(false);
          mostrarAlerta('Ocurrió un error al intentar enviar el txt.');
          console.error('Error Servicio "Rules_Gestor.exportarInscripcionesProgramaAExcel": ' + error);
        });
    });
  }

  habilitarInscripcionAulaVirtual = () => {
    const habilitarExcelAccesoAulaVirtual = this.state.programaFiltroSeleccionado != -1 && this.state.cursoFiltroSeleccionado != -1 && _.find(this.state.arrayProgramas, (o) => { return o.value == this.state.programaFiltroSeleccionado && o.esVirtual == true });

    if (!habilitarExcelAccesoAulaVirtual) {
      mostrarAlerta('Para habilitar Aula Virtual debe seleccionar un curso virtual.');
      return false;
    }

    const idCurso = this.state.cursoFiltroSeleccionado;

    this.props.mostrarCargando(true);
    const token = this.props.loggedUser.token;

    this.props.mostrarCargando(false);

    this.setState({
      dialogoOpenHabilitarAulaVirtual: false
    }, () => {
      Rules_Gestor.habilitarInscripcionAulaVirtual(token, {
        idCurso: idCurso
      })
        .then((datos) => {

          if (!datos.ok) {
            this.props.mostrarCargando(false);
            mostrarAlerta(datos.error);
            return false;
          }

          this.props.mostrarCargando(false);
          mostrarMensaje('Se habilitó el Aula Virtual exitosamente!');
          this.cargarPreinscriptos();
        })
        .catch((error) => {
          this.props.mostrarCargando(false);
          mostrarAlerta('Ocurrió un error al intentar habilitar el Aula Virtual.');
          console.error('Error Servicio "Rules_Gestor.habilitarInscripcionAulaVirtual": ' + error);
        });
    });
  }

  render() {
    const { classes, paraMobile } = this.props;
    const {
      programaFiltroSeleccionado,
      programaFiltroSeleccionadoPreinscripcion,
      cursoFiltroSeleccionado,
      cursoFiltroSeleccionadoPreinscripcion,
      aulaFiltroSeleccionado,
      rowList,
      dialogConfirmacion,
      dialogCancelacion,
      dialogPreinscripcion,
      dialogImpresionReporte,
      arrayProgramas,
      arrayCursos,
      arrayAulas,
      arrayReporte,
      valueInputLugar,
      valueInputCUIT,
      valueInputNombre,
      checkEmpresa,
      formInputsEmpresa,
      cursoSeleccionado,
      valueEmailExcel
    } = this.state;

    let programasInReporte = [];

    //Set inputs
    const InputNombreEmpresa = _.find(formInputsEmpresa, { id: 'InputNombreEmpresa' });
    const InputDescripcionEmpresa = _.find(formInputsEmpresa, { id: 'InputDescripcionEmpresa' });
    const InputCuitEmpresa = _.find(formInputsEmpresa, { id: 'InputCuitEmpresa' });
    const InputContactoEmpresa = _.find(formInputsEmpresa, { id: 'InputContactoEmpresa' });

    const habilitarExcelAccesoAulaVirtual = programaFiltroSeleccionado != -1 && cursoFiltroSeleccionado != -1 && _.find(arrayProgramas, (o) => { return o.value == programaFiltroSeleccionado && o.esVirtual == true });

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
                      <MiSelect
                        onChange={this.handleSelectFiltroCursos}
                        value={cursoFiltroSeleccionado}
                        label="Cursos"
                        fullWidth={true}
                        options={_.filter(arrayCursos, (o) => { return o.idPrograma == programaFiltroSeleccionado || programaFiltroSeleccionado == -1 })} />
                      {cursoFiltroSeleccionado != -1 && <Icon className={classes.limpiarSelect} onClick={this.handleQuitarFiltroCursos}>clear</Icon>}
                    </Grid>

                    {arrayAulas && arrayAulas.length > 0 &&
                      <Grid item xs={12} sm={12} className={classes.centerItems}>
                        <MiSelect
                          onChange={this.handleSelectFiltroAulas}
                          value={aulaFiltroSeleccionado}
                          label="Aulas"
                          fullWidth={true}
                          options={arrayAulas} />
                        {aulaFiltroSeleccionado != -1 && <Icon className={classes.limpiarSelect} onClick={this.handleQuitarFiltroAulas}>clear</Icon>}
                      </Grid>}

                  </Grid>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Grid container>
                    <Grid item xs={12} sm={12} className={classes.centerItems}>
                      <MiInput
                        id={'InputCUIT'}
                        tipoInput={'input'}
                        type={'text'}
                        value={valueInputCUIT}
                        error={false}
                        mensajeError={false}
                        label={'Buscar por CUIT'}
                        placeholder={'Ingrese el CUIT del preinscripto...'}
                        onChange={this.onChangeInputCUIT}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} className={classes.centerItems}>
                      <MiInput
                        id={'Apellido/Nombre'}
                        tipoInput={'input'}
                        type={'text'}
                        value={valueInputNombre}
                        error={false}
                        mensajeError={false}
                        label={'Buscar por Apellido/Nombre'}
                        placeholder={'Ingrese el Apellido/Nombre del preinscripto...'}
                        onChange={this.onChangeInputNombre}
                      />
                    </Grid>

                    <Grid item xs={12} sm={12} className={classes.centerItems}>
                      <React.Fragment>
                        <MiInput
                          id={'InputLugar'}
                          tipoInput={'input'}
                          type={'text'}
                          value={valueInputLugar}
                          error={false}
                          mensajeError={false}
                          label={'Buscar por Lugar'}
                          placeholder={'Ingrese el lugar del curso...'}
                          onChange={this.onChangeInputLugar}
                        />
                      </React.Fragment>
                      <section className={classes.containerBotonera}>
                        <Button
                          variant="contained"
                          color="primary"
                          className={classes.buttonActions}
                          onClick={this.handleBuscarPreinscriptos}
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
            <MiCard titulo={"Lista de Preinscriptos (Resultados: "+rowList.length+" filas)"}>
              {/* Tabla de detalle del tributo */}
              {rowList.length > 0 && <React.Fragment>
                <div className={classes.buttonDescargaReporte}>
                  {habilitarExcelAccesoAulaVirtual && <React.Fragment>
                    <Button color="primary" variant="outlined" onClick={this.onDialogoOpenEmailExcel}>Exportar Txt</Button>

                    <Button color="primary" variant="outlined" onClick={this.onDialogoOpenHabilitarAulaVirtual}>Habilitar Aula Virtual</Button>
                  </React.Fragment>}

                  <Button onClick={this.onDialogOpenImpresionReporte} color="primary" variant="outlined" >
                    Descargar Reporte
              </Button>
                </div>
              </React.Fragment>}

              <MiTabla
                classPaper={classes.contentTable}
                pagination={true}
                columns={[
                  { id: 'cuit', type: 'string', numeric: false, disablePadding: false, label: 'CUIT' },

                  { id: 'apellidoNombre', type: 'string', numeric: false, disablePadding: false, label: 'Apellido Nombre' },

                  { id: 'programa', type: 'string', numeric: false, disablePadding: false, label: 'Programa' },
                  { id: 'curso', type: 'string', numeric: false, disablePadding: false, label: 'Curso' },
                  { id: 'aula', type: 'string', numeric: false, disablePadding: false, label: 'Aula' },

                  { id: 'fechaPreinscricion', type: 'string', numeric: false, disablePadding: false, label: 'Fecha Preinsc.' },

                  { id: 'acceso', type: 'string', numeric: false, disablePadding: false, label: 'Con Acceso' },
                  { id: 'codigo', type: 'string', numeric: false, disablePadding: false, label: 'Código Certf.' },

                  { id: 'acciones', type: 'custom', numeric: false, disablePadding: false, label: 'Acciones' },
                ]}
                rows={rowList || []}
                sortTable={false}
                rowsPerPage={30}
              />
            </MiCard>
          </Grid>
        </Grid>

        <MiControledDialog
          open={dialogConfirmacion}
          onDialogoOpen={this.onDialogOpenConfirmacion}
          onDialogoClose={this.onDialogCloseConfirmacion}
          buttonOptions={{
            onDialogoAccept: this.onDialogoAcceptConfirmacion,
            onDialogoCancel: this.onDialogoCancelConfirmacion,
          }}
          titulo={'Confirmación de Preinscripción'}
        >
          ¿Esta segura que desea confirmar la preinscripción del usuario seleccionado?
        </MiControledDialog>

        <MiControledDialog
          open={dialogImpresionReporte}
          onDialogoOpen={this.onDialogOpenImpresionReporte}
          onDialogoClose={this.onDialogCloseImpresionReporte}
          titulo={'Imprimir'}
        >
          {/* imgPerfil: <Avatar src="https://servicios2.cordoba.gov.ar/cordobafiles/archivo/f_qdag0f9irgka9xj2l6mbll69gxmhlghezkmkj2mykg1pj0uuhwogqiqfic_c327l9gmyk9tutz1fuq0rc3_z2byq5gcg2j5tjpqcn6jid4x2rlv2nsaa2it7s64d7m2k4h7e_xegt2w8p79uvk4jj42a7uvrcfm1cn8jpq31o4raxvsv8ktwtsa_q6iqbxeop56c_zee/3" />,
          cuit: '20355266169',
          apellidoNombre: 'Dotta, Adrian',
          email: 'adridotta@gmail.com',
          programa: 'SI ESTUDIO +24',
          curso: 'Carpinteria',
           */}
          <ReportePDF className={classes.containerReporte}>
            <img className={classNames(classes.imgMuni, 'imgMuni')} src="data:image/png;base64,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" />
            <Typography variant="headline" className={classes.tituloReporte}>Reporte SiSi Presencial</Typography>
            {(arrayReporte.length > 0 && arrayReporte.map((grupo) => {
              const idPrograma = parseInt(grupo.idPrograma);
              const itemPrograma = _.find(arrayProgramas, { value: idPrograma });
              const nombrePrograma = itemPrograma ? itemPrograma.label : '';

              return <React.Fragment>
                {nombrePrograma && <Typography variant="title" className={classNames(classes.tituloPrograma, "tituloPrograma")}>{nombrePrograma}</Typography>}
                {grupo.cursos.map((curso) => {
                  const idCurso = parseInt(curso.idCurso);
                  const itemCurso = _.find(arrayCursos, { value: idCurso });
                  const nombreCurso = itemCurso ? itemCurso.label : '';

                  return <React.Fragment>
                    {nombreCurso && <Typography variant="title" className={classNames(classes.tituloCurso, "tituloCurso")}>{nombreCurso}</Typography>}
                    <table className={classNames(classes.tablasReporte, "tablasReporte")}>
                      <thead>
                        <tr>
                          <th>CUIT</th>
                          <th>Apellido/Nombre</th>
                          <th>Email</th>
                          <th>Fecha Preinsc.</th>
                          <th>Lugar</th>
                          <th>Horario</th>
                        </tr>
                      </thead>
                      <tbody>
                        {curso.preinscriptos.map((preinscriptos) => {
                          return <tr>
                            <td>{preinscriptos.cuit}</td>
                            <td>{preinscriptos.apellidoNombre}</td>
                            <td>{preinscriptos.data.email}</td>
                            <td>{preinscriptos.fechaPreinscricion}</td>
                            <td>{preinscriptos.lugar}</td>
                            <td>{preinscriptos.horario}</td>
                          </tr>;
                        })}
                      </tbody>
                    </table>
                  </React.Fragment>;
                })}
              </React.Fragment>
            })) || <Typography variant="title">No se encontraron datos para generar el reporte</Typography>}
          </ReportePDF>
        </MiControledDialog>

        <MiControledDialog
          open={dialogCancelacion}
          onDialogoOpen={this.onDialogOpenCancelacion}
          onDialogoClose={this.onDialogCloseCancelacion}
          buttonOptions={{
            onDialogoAccept: this.desinscripcionAceptada,
            onDialogoCancel: this.onDialogCloseCancelacion,
          }}
          titulo={'Desinscripción'}
        >
          ¿Esta segura que desea desinscribir el usuario seleccionado?
        </MiControledDialog>

        <MiControledDialog
          open={dialogPreinscripcion}
          onDialogoOpen={this.onDialogOpenPreinscripcion}
          onDialogoClose={this.onDialogClosePreinscripcion}
          buttonOptions={{
            onDialogoAccept: this.preinscripcionAceptada,
            onDialogoCancel: this.onDialogClosePreinscripcion,
          }}
          titulo={'Preinscripción'}
        >
          <Grid container spacing={16}>
            <Grid item xs={12} sm={6} className={classes.centerItems}>
              <MiSelect
                onChange={this.handleSelectFiltroProgramaPreinscripcion}
                value={programaFiltroSeleccionadoPreinscripcion}
                label="Programas"
                fullWidth={true}
                options={arrayProgramas} />
              {programaFiltroSeleccionadoPreinscripcion != -1 && <Icon className={classes.limpiarSelect} onClick={this.handleQuitarFiltroProgramaPreinscripcion}>clear</Icon>}
            </Grid>
            <Grid item xs={12} sm={6} className={classes.centerItems}>
              <MiSelect
                onChange={this.handleSelectFiltroCursosPreinscripcion}
                value={cursoFiltroSeleccionadoPreinscripcion}
                label="Cursos"
                fullWidth={true}
                options={_.filter(arrayCursos, (o) => { return o.idPrograma == programaFiltroSeleccionadoPreinscripcion })} />
              {cursoFiltroSeleccionadoPreinscripcion != -1 && <Icon className={classes.limpiarSelect} onClick={this.handleQuitarFiltroCursosPreinscripcion}>clear</Icon>}
            </Grid>

            {cursoSeleccionado && cursoSeleccionado.necesitaEmpresa &&
              <Grid item xs={12} sm={12}>
                <b>¿Desea sugerir una empresa?</b>
                <RadioGroup
                  value={checkEmpresa}
                  onChange={this.handleChangeCheckEmpresa}
                >
                  <FormControlLabel style={{ height: '26px' }} value={'noEmpresa'} control={<Radio color="primary" />} label="No deseo sugerir una empresa" />
                  <FormControlLabel style={{ height: '26px' }} value={'siEmpresa'} control={<Radio color="primary" />} label="Deseo sugerir una empresa" />
                </RadioGroup>
                <br />
                {checkEmpresa == 'siEmpresa' &&
                  <React.Fragment>
                    <Grid container>
                      <Grid item xs={12} sm={12}>
                        <MiInput
                          onChange={this.onChangeInput}
                          onFocusOut={this.onFocusOutInput}
                          id={'InputNombreEmpresa'}
                          tipoInput={'input'}
                          type={'text'}
                          value={InputNombreEmpresa && InputNombreEmpresa.value || ''}
                          error={InputNombreEmpresa && InputNombreEmpresa.error || false}
                          mensajeError={InputNombreEmpresa && InputNombreEmpresa.mensajeError || 'Campo erroneo'}
                          label={'Nombre de la empresa'}
                          placeholder={'Ingrese el nombre de la empresa...'}
                        />
                      </Grid>
                      <br /><br /><br />
                      <Grid item xs={12} sm={12}>
                        <MiInput
                          onChange={this.onChangeInput}
                          onFocusOut={this.onFocusOutInput}
                          id={'InputDescripcionEmpresa'}
                          tipoInput={'input'}
                          type={'text'}
                          value={InputDescripcionEmpresa && InputDescripcionEmpresa.value || ''}
                          error={InputDescripcionEmpresa && InputDescripcionEmpresa.error || false}
                          mensajeError={InputDescripcionEmpresa && InputDescripcionEmpresa.mensajeError || 'Campo erroneo'}
                          label={'Descripción de la empresa'}
                          placeholder={'Describa la actividad de la empresa...'}
                        />
                      </Grid>
                      <br /><br /><br />
                      <Grid container>
                        <Grid item xs={12} sm={6}>
                          <MiInput
                            onChange={this.onChangeInput}
                            onFocusOut={this.onFocusOutInput}
                            id={'InputCuitEmpresa'}
                            tipoInput={'input'}
                            type={'text'}
                            value={InputCuitEmpresa && InputCuitEmpresa.value || ''}
                            error={InputCuitEmpresa && InputCuitEmpresa.error || false}
                            mensajeError={InputCuitEmpresa && InputCuitEmpresa.mensajeError || 'Campo erroneo'}
                            label={'CUIT de la empresa'}
                            placeholder={'(Opcional) Si lo conoces, ingrese el CUIT de la empresa...'}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <MiInput
                            onChange={this.onChangeInput}
                            onFocusOut={this.onFocusOutInput}
                            id={'InputContactoEmpresa'}
                            tipoInput={'input'}
                            type={'text'}
                            value={InputContactoEmpresa && InputContactoEmpresa.value || ''}
                            error={InputContactoEmpresa && InputContactoEmpresa.error || false}
                            mensajeError={InputContactoEmpresa && InputContactoEmpresa.mensajeError || 'Campo erroneo'}
                            label={'Contacto de la empresa'}
                            placeholder={'Ingrese el contacto Cde la empresa...'}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <br />
                    <div className={classes.containerInfoEmpresa}>
                      <i className={classNames('material-icons', classes.classIconoInfo)}>info</i>
                      <Typography variant="body2">Para sugerir una empresa es OBLIGATORIO llenar la siguiente planilla en papel y acercarla al Centro de Empleo y Capacitación (Galería Cinerama Av. Colon 335 subsuelo) de 8:30 a 14:30 hs</Typography>
                    </div>

                    <Button
                      href={'https://drive.google.com/file/d/1V1PZUlkCHhXhZhvQh_AKEjD4gszEESOF/view'}
                      target="_blank"
                      className={classes.buttonDescargaPlanilla}
                    >
                      Descargar Planilla
                      </Button>
                  </React.Fragment>
                }
              </Grid>}
          </Grid>
        </MiControledDialog>

        <MiControledDialog
          paraMobile={paraMobile}
          open={this.state.dialogoOpenEmailExcel}
          onDialogoOpen={this.onDialogoOpenEmailExcel}
          onDialogoClose={this.onDialogoCloseEmailExcel}
          titulo={'Email Exportación Txt'}
          buttonOptions={{
            onDialogoAccept: this.exportarInscripcionesProgramaAExcel,
            onDialogoCancel: this.onDialogoCloseEmailExcel
          }}
          classContainterContent={classes.widthInputEmailExcel}
        >
          <div key="mainContent">
            <MiInput
              id={'InputEmailExcel'}
              tipoInput={'input'}
              type={'text'}
              value={valueEmailExcel}
              error={false}
              mensajeError={false}
              label={'Ingrese email al que se le enviará el txt'}
              placeholder={'Ingrese Email...'}
              onChange={this.onChangeInputEmailExcel}
            />
          </div>
        </MiControledDialog>

        <MiControledDialog
          paraMobile={paraMobile}
          open={this.state.dialogoOpenHabilitarAulaVirtual}
          onDialogoOpen={this.onDialogoOpenHabilitarAulaVirtual}
          onDialogoClose={this.onDialogoCloseHabilitarAulaVirtual}
          titulo={'Habilitar Aula Virtual'}
          buttonOptions={{
            onDialogoAccept: this.habilitarInscripcionAulaVirtual,
            onDialogoCancel: this.onDialogoCloseHabilitarAulaVirtual
          }}
        >
          <div key="mainContent">
            <Typography>¿Está seguro que desea habilitar el acceso a Aula Virtual para los alumnos del curso seleccionado?</Typography>
          </div>
        </MiControledDialog>

      </section>
    );
  }
}

let componente = Home;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
import React from "react";
import { withRouter } from "react-router-dom";
import _ from "lodash";

//Styles
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import classNames from "classnames";

//Redux
import { mostrarCargando } from '@Redux/Actions/mainContent'
import { actualizarPreinscipcion } from '@Redux/Actions/usuario';

//Material UI
import Divider from '@material-ui/core/Divider';
import Button from "@material-ui/core/Button";
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

//Mis Componentes
import MiCard from "@Componentes/MiNewCard";
import MiInput from "@Componentes/MiInput";
import IndicadorCargando from "@UI/_Componentes/IndicadorCargando"

import { mostrarAlerta } from "@Utils/functions";

import MiControledDialog from "@Componentes/MiControledDialog";

import Rules_Preinscripcion from "@Rules/Rules_Preinscripcion";

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
  actualizarPreinscipcion: (data) => {
    dispatch(actualizarPreinscipcion(data));
  }
});

class SeleccionPrograma extends React.PureComponent {
  constructor(props) {
    super(props);

    const arrayCursos = props.arrayCursos || [];
    let infoCurso;
    let cursosXTags;
    if (arrayCursos.length == 1) {
      infoCurso = this.getInfoCurso(arrayCursos[0]);
    } else {
      cursosXTags = [];
      const tags = _.groupBy(arrayCursos, (o) => { return o.tag });

      Object.keys(tags).map((tag) => {
        let cursosXTag = {
          'tag': tag,
          'categorias': []
        };

        const categorias = _.groupBy(tags[tag], (o) => { return o.tag.split(';')[1] });

        Object.keys(categorias).map((categoria) => {
          let cursosXCategoria = {
            'tag': categoria == "undefined" ? 'Otros' : categoria,
            'cursos': categorias[categoria]
          };

          cursosXTag.categorias.push(cursosXCategoria);
        });

        cursosXTags.push(cursosXTag);
      });

      if (cursosXTags.null && Object.keys(cursosXTags).length == 1) cursosXTags = null;
    }

    this.state = {
      dialogoOpen: false,
      dialogoOpenInfoCurso: false,
      dialogTituloCurso: infoCurso ? infoCurso.dialogTituloCurso : null,
      dialogSubTituloCurso: infoCurso ? infoCurso.dialogSubTituloCurso : null,
      dialogInformacionCurso: infoCurso ? infoCurso.dialogInformacionCurso : null,
      cursoSeleccionado: infoCurso ? infoCurso.cursoSeleccionado : undefined,
      dialogoOpenInfoPreInscripcion: false,
      inputBuscador: '',
      cursos: arrayCursos,
      listaCursos: arrayCursos,
      cursosXTags: cursosXTags,
      cursoPreinscripto: '',
      cargandoVisible: false,
    };
  }

  onDialogoOpen = () => {
    this.setState({ dialogoOpen: true });
  }

  onDialogoClose = () => {
    this.setState({ dialogoOpen: false });
  }

  onDialogoOpenInfoCurso = () => {
    this.setState({ dialogoOpenInfoCurso: true });
  }

  onDialogoCloseInfoCurso = () => {
    this.setState({
      dialogoOpenInfoCurso: false
    });
  }

  onDialogoOpenInfoPreInscripcion = () => {
    this.setState({ dialogoOpenInfoPreInscripcion: true });
  }

  onDialogoCloseInfoPreInscripcion = () => {
    this.setState({ dialogoOpenInfoPreInscripcion: false }, () => {
      //this.props.cambioEstadoPreinscripcion && this.props.cambioEstadoPreinscripcion(true);
    });
  }

  handleFinalizar = () => {
    window.location.reload();
  }

  onDialogoEliminarPreInscripcion = () => {
    this.onDialogoClose();

    this.props.mostrarCargando(true);
    const token = this.props.loggedUser.token;

    Rules_Preinscripcion.deletePreinscripcion(token)
      .then((datos) => {
        this.props.mostrarCargando(false);

        if (!datos.ok) {
          mostrarAlerta(datos.error);
          return false;
        }

        this.props.actualizarPreinscipcion(null);
        this.setState({ dialogoOpenInfoPreInscripcion: false }, () => {
          //this.props.cambioEstadoPreinscripcion && this.props.cambioEstadoPreinscripcion(false);
        });
      })
      .catch((error) => {
        this.props.mostrarCargando(false);
        mostrarAlerta('Ocurrió un error al intentar desinscribirte.');
        console.error('Error Servicio "Rules_Preinscripcion.deletePreinscripcion": ' + error);
      });
  }

  onChangeInputBusqueda = (value) => {
    var inputValue = value;
    var arrayCursosFiltrados = this.getCursosFiltrados(inputValue);

    this.setState({
      inputBuscador: inputValue,
      listaCursos: arrayCursosFiltrados
    });
  }

  getCursosFiltrados = (inputValue) => {
    var stateArrayCursos = this.state.cursos;

    if (inputValue == '')
      return stateArrayCursos;
    else
      return _.filter(stateArrayCursos, (item) => { return (item.nombre + (item.lugar ? " - " + item.lugar : '')).toLowerCase().indexOf(inputValue.toLowerCase()) != -1 });
  }

  onClickCurso = (event) => {
    var idCurso = event.currentTarget.attributes.idCurso.value;

    idCurso = !isNaN(idCurso) ? parseInt(idCurso) : idCurso;
    var cursos = this.state.cursos;

    var cursoSeleccionado = _.find(cursos, { id: idCurso });

    const infoCurso = this.getInfoCurso(cursoSeleccionado);

    this.setState({
      dialogoOpenInfoCurso: infoCurso.dialogoOpenInfoCurso,
      dialogTituloCurso: infoCurso.dialogTituloCurso,
      dialogSubTituloCurso: infoCurso.dialogSubTituloCurso,
      dialogInformacionCurso: infoCurso.dialogInformacionCurso,
      cursoSeleccionado: infoCurso.cursoSeleccionado,
    });
  }

  getInfoCurso = (cursoSeleccionado) => {

    if (cursoSeleccionado) {

      let informacionCurso = '¿Esta seguro que desea preinscribirse a este curso?';
      const hayDescripcion1 = cursoSeleccionado.descripcion1 != null && cursoSeleccionado.descripcion1 != '';
      const hayDescripcion2 = cursoSeleccionado.descripcion2 != null && cursoSeleccionado.descripcion2 != '';

      if (hayDescripcion1 || hayDescripcion2) {

        if (cursoSeleccionado.idPrograma != 10) {
          informacionCurso = `<span>\
            ${hayDescripcion1 ? cursoSeleccionado.descripcion1 : ''}
            ${hayDescripcion1 && hayDescripcion2 ? '<span><br /><br /></span>' : ''}
            ${hayDescripcion2 ? cursoSeleccionado.descripcion2 : ''}
          </span>`;
        } else {
          informacionCurso = `<span>\
            ${hayDescripcion1 ? `<span><b>¿Qué aprenderás?</b><br />${cursoSeleccionado.descripcion1}</span>` : ''}\
            ${hayDescripcion1 && hayDescripcion2 ? '<span><br /><br /></span>' : ''}\
            ${hayDescripcion2 ? `<span><b>¿Qué podrás hacer?</b><br />${cursoSeleccionado.descripcion2}</span>` : ''}\
          </span>`;
        }
      }

      return {
        dialogoOpenInfoCurso: true,
        dialogTituloCurso: cursoSeleccionado.nombre + (cursoSeleccionado.lugar ? ' - ' + cursoSeleccionado.lugar : ''),
        dialogSubTituloCurso: (cursoSeleccionado.dia ? cursoSeleccionado.dia + " - " : '') + "" + (cursoSeleccionado.horario ? cursoSeleccionado.horario : ''),
        dialogInformacionCurso: informacionCurso,
        cursoSeleccionado: cursoSeleccionado
      };
    } else {
      return false;
    }
  }

  procesarPreInscripcion = () => {

    this.setState({
      cargandoVisible: true
    }, () => {
      const token = this.props.loggedUser.token;
      const curso = this.state.cursoSeleccionado;

      if (!curso) {
        this.setState({
          cargandoVisible: false
        });
        return false;
      }

      let body = {
        "idCurso": curso.id,
        "tieneEmpresa": false,
        "nombreEmpresa": '',
        "cuitEmpresa": '',
        "domicilioEmpresa": '',
        "descripcionEmpresa": ''
      }

      this.onDialogoCloseInfoCurso();

      Rules_Preinscripcion.insertPreinscripcion(token, body)
        .then((datos) => {
          if (!datos.ok) {
            this.setState({
              cargandoVisible: false,
              cursoSeleccionado: undefined
            });
            mostrarAlerta(datos.error);
            return false;
          }

          this.props.actualizarPreinscipcion(datos.return);


          let cursoPreinscripto = '';
          if (datos.return && datos.return.curso) {
            let lugar = '';
            let diaHorario = '';

            if (datos.return.curso.lugar)
              lugar = <React.Fragment> en {datos.return.curso.lugar}</React.Fragment>;

            if (datos.return.curso.dia)
              diaHorario = <React.Fragment> el {datos.return.curso.dia} {datos.return.curso.horario}</React.Fragment>;

            cursoPreinscripto = <React.Fragment>a <br /><span style={{ fontWeight: '100' }}>{datos.return.curso.nombre}{lugar}{diaHorario}</span><br /></React.Fragment>;
          }

          this.setState({
            cargandoVisible: false,
            dialogoOpenInfoPreInscripcion: true,
            cursoPreinscripto: cursoPreinscripto,
            cursoSeleccionado: undefined
          });
        })
        .catch((error) => {
          this.setState({
            cargandoVisible: false,
            cursoSeleccionado: undefined
          });
          mostrarAlerta('Ocurrió un error al intentar preinscribirte.');
          console.error('Error Servicio "Rules_Preinscripcion.insertPreinscripcion": ' + error);
        });
    });
  }

  volverInicio = () => {
    this.props.redireccionar("/Inicio");
  }

  render() {
    const {
      classes,
      textoBoton,
      textoBotonDialog,
      textoInformativo,
      tituloPrograma,
      classTituloPrograma,
      classTextoInformativo,
      loggedUser
    } = this.props;

    const {
      dialogoOpen,
      listaCursos,
      cursosXTags,
      inputBuscador,
      dialogoOpenInfoCurso,
      dialogTituloCurso,
      dialogSubTituloCurso,
      dialogInformacionCurso,
      dialogoOpenInfoPreInscripcion,
      cursoPreinscripto,
      cargandoVisible
    } = this.state;

    const arrayCursosXTag = cursosXTags ? _.orderBy(cursosXTags, ['tag'], ['asc']) : [];

    const dialogInformacionCursoHTML = dialogInformacionCurso ? <div dangerouslySetInnerHTML={{ __html: dialogInformacionCurso }} /> : '';

    const textoInformativoHTML = textoInformativo ? <div dangerouslySetInnerHTML={{ __html: textoInformativo }} /> : '';

    return (
      <React.Fragment>
        <IndicadorCargando visible={cargandoVisible} />
        <MiCard
          informacionAlerta={tituloPrograma}
          classInformacionAlerta={classTituloPrograma}
          contentClassName={classes.infoPrograma}
          seccionBotones={{
            align: 'space-between',
            content: <React.Fragment>
              <Button onClick={this.volverInicio} variant="outlined" color="primary" className={classes.button}>
                <Icon className={classNames(classes.iconoBoton, classes.secondaryColor)}>arrow_back_ios</Icon>
                Atrás</Button>

              <Button onClick={listaCursos.length == 1 ? this.onDialogoOpenInfoCurso : this.onDialogoOpen} variant="outlined" color="primary" className={classes.button}>
                INSCRIBIRME</Button>
            </React.Fragment>
          }}
        >
          <Typography variant="subheading" className={classTextoInformativo}>{textoInformativoHTML}</Typography>
        </MiCard>

        <MiControledDialog
          open={dialogoOpen}
          onDialogoOpen={this.onDialogoOpen}
          onDialogoClose={this.onDialogoClose}
          titulo={arrayCursosXTag && arrayCursosXTag.length > 0 ? 'Categorias / Cursos' : 'Cursos'}
        >
          <div key="headerContent">
            {!(arrayCursosXTag && arrayCursosXTag.length > 0) &&
              <MiInput
                onChange={this.onChangeInputBusqueda}
                icono={'search'}
                tipoInput={'input'}
                type={'text'}
                value={inputBuscador}
                placeholder={'Buscar cursos...'}
              />}
          </div>
          <div key="mainContent">
            {(arrayCursosXTag && arrayCursosXTag.length > 0 &&
              <section className={classes.containerPanelCategoria}>
                {arrayCursosXTag.map((tag, index) => {

                  return <ExpansionPanel className={classes.panel}>
                    <ExpansionPanelSummary className={classes.containerTitulo} expandIcon={<ExpandMoreIcon className={classes.iconoTag} />}>
                      <Typography className={classes.tituloTag}>{tag.tag}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={classes.containerListaSubTags}>


                      {tag.categorias.map((categoria) => {

                        const cursos = categoria.cursos;
                        return <ExpansionPanel className={classes.panelCategoria}>
                            <ExpansionPanelSummary className={classes.containerTituloCategoria} expandIcon={<ExpandMoreIcon className={classes.iconoCategoria} />}>
                              <Typography className={classes.tituloCategoria}>{categoria.tag}</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails className={classes.containerListaCursos}>
                              <List className={classes.lista}>
                                {
                                  cursos && cursos.length &&
                                  cursos.map((curso) => {
                                    var result = _.filter(loggedUser.datos.preinscripcionesVirtuales || [], (o) => o.curso && o.curso.id == curso.id);

                                    return <ListItem
                                      className={classes.itemLista}
                                      onClick={result.length == 0 && this.onClickCurso}
                                      idCurso={curso.id}>
                                      <ListItemText
                                        primary={<React.Fragment>{curso.nombre + (curso.lugar ? " - " + curso.lugar : '')} {(result.length > 0 ? <span className={classes.tagInscripto}> Inscripto</span> : '')}</React.Fragment>}
                                        secondary={(curso.dia ? curso.dia + " - " : '') + "" + (curso.horario ? curso.horario : '')}
                                      />
                                    </ListItem>
                                  })
                                  ||
                                  <ListItem className={classes.itemLista}>
                                    <ListItemText
                                      primary={'No se encontraron cursos'}
                                    />
                                  </ListItem>
                                }
                              </List>
                            </ExpansionPanelDetails>
                          </ExpansionPanel>;

                      })}


                      </ExpansionPanelDetails>
                  </ExpansionPanel>;
                })
                }
              </section>
            ) ||
              <List className={classes.lista}>
                {
                  listaCursos && listaCursos.length &&
                  listaCursos.map((curso) => {
                    return <ListItem
                      className={classes.itemLista}
                      onClick={this.onClickCurso}
                      idCurso={curso.id}>
                      <ListItemText
                        primary={curso.nombre + (curso.lugar ? " - " + curso.lugar : '')}
                        secondary={(curso.dia ? curso.dia + " - " : '') + "" + (curso.horario ? curso.horario : '')}
                      />
                    </ListItem>
                  })
                  ||
                  <ListItem className={classes.itemLista}>
                    <ListItemText
                      primary={'No se encontraron cursos'}
                    />
                  </ListItem>
                }
              </List>}
          </div>
          <div key="footerContent"></div>
        </MiControledDialog>

        <MiControledDialog
          open={dialogoOpenInfoCurso}
          onDialogoOpen={this.onDialogoOpenInfoCurso}
          onDialogoClose={this.onDialogoCloseInfoCurso}
          titulo={'Curso del programa ' + dialogTituloCurso}
          subtitulo={dialogSubTituloCurso}
          botonera={
            <div className={classes.containerBotonera}>
              <Divider />
              <div className={classes.botonesBotonera}>
                <Button variant="outlined" color="primary" className={classes.button} onClick={this.onDialogoCloseInfoCurso}>Otro Curso</Button>
                <Button variant="outlined" color="primary" className={classes.button} onClick={this.procesarPreInscripcion}>{textoBotonDialog || 'INSCRIBIRME'}</Button>
              </div>
            </div>
          }
        >
          <div key="mainContent">
            {dialogInformacionCursoHTML}
          </div>
        </MiControledDialog>


        <MiControledDialog
          open={dialogoOpenInfoPreInscripcion}
          onDialogoOpen={this.onDialogoOpenInfoPreInscripcion}
          onDialogoClose={this.onDialogoCloseInfoPreInscripcion}
          classContainterContent={classes.contenedorInfoPreInscripcion}
          botonera={true}
        >
          <Icon className={classes.iconoOKPreInscripcion}>check_circle_outline</Icon>
          <Typography variant={'title'} style={{ fontSize: '30px' }}>
            Tu preinscripción {cursoPreinscripto} fue realizada con éxito
          </Typography>
          <br />
          <Typography variant="subheading">
            Te enviamos un mail a {loggedUser.datos.email} con el comprobante del registro
          </Typography>
          <br /><br />
          <React.Fragment>
            <Button variant="outlined" color="primary" className={classes.button} onClick={this.handleFinalizar}>Finalizar</Button>
          </React.Fragment>
        </MiControledDialog>
      </React.Fragment>
    );
  }
}

const styles = theme => ({
  bottomContent: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  itemLista: {
    minWidth: '400px',
    cursor: 'pointer',
    '&:hover': {
      background: '#e4e4e4'
    }
  },
  containerBotonera: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    '& > *': {
      width: '100%',
    }
  },
  iconoBoton: {
    fontSize: '16px',
  },
  botonesBotonera: {
    textAlign: 'center',
    margin: '12px auto',
    marginTop: '18px',
  },
  iconoOKPreInscripcion: {
    color: theme.color.ok.main,
    fontSize: '100px',
    display: 'block',
    margin: '0px auto',
  },
  contenedorInfoPreInscripcion: {
    textAlign: 'center',
    maxWidth: '500px',
  },
  classIconoInfo: {
    margin: '0px 14px 0px 0px',
    color: '#ffb300'
  },
  classIconoDownload: {
    margin: '0px 14px 0px 0px',
    color: theme.color.ok.main,
    textDecoration: 'none'
  },
  containerInfoEmpresa: {
    display: 'flex',
    alignItems: 'center'
  },
  buttonDescargaPlanilla: {
    color: theme.color.ok.main,
    textDecoration: 'underline',
    marginLeft: '24px'
  },
  panel: {
    width: '100%',
    background: theme.color.ok.main,
    borderRadius: '4px !important',
    boxShadow: 'none'
  },
  panelCategoria: {
    width: '100%',
    background: '#fff',
    borderBottomRightRadius: '4px !important',
    borderBottomLeftRadius: '4px !important',
  },
  iconoTag: {
    color: '#fff'
  },
  iconoCategoria: {
    color: theme.color.ok.main,
  },
  tituloTag: {
    color: '#fff'
  },
  tituloCategoria: {
    color: theme.color.ok.main,
  },
  containerListaCursos: {
    background: '#fff'
  },
  containerListaSubTags: {
    padding: '0px',
    background: '#fff',
    border: '1px solid #fff'
  },
  containerTitulo: {
    marginTop: '8px',
    borderRadius: '4px !important',
  },
  containerTituloCategoria: {
    marginTop: '8px',
    borderBottomRightRadius: '4px !important',
    borderBottomLeftRadius: '4px !important',
    background: '#fff',
    minHeight: '34px',
    margin: '4px auto',
    '& > div': {
      margin: '0px'
    }
  },
  containerPanelCategoria: {
    marginBottom: '10px'
  },
  lista: {
    width: '100%'
  },
  tagInscripto: {
    display: 'inline-block',
    fontWeight: '400',
    border: '1px solid ' + theme.color.ok.main,
    borderRadius: '6px',
    padding: '0px 7px',
    marginLeft: '7px',
    color: theme.color.ok.main,
  },
  infoPrograma: {
    maxHeight: '300px',
    overflowY: 'auto',
  }
});

let componente = SeleccionPrograma;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
import React from "react";
import { withRouter } from "react-router-dom";
import CordobaFilesUtils from "@Utils/CordobaFiles";

import _ from "lodash";

//Styles
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import classNames from "classnames";

//Redux
import { mostrarCargando } from '@Redux/Actions/mainContent'
import { push } from "connected-react-router";

//Components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from "@material-ui/core/Avatar";
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from "@material-ui/core/Button";

import MiControledDialog from "@Componentes/MiControledDialog";

import Export from "@Utils/Export"

import { arrayTipoEstudios } from '@DatosEstaticos/EstudiosRealizados.js'

//Funciones
import { calcularEdad, dateToString, mostrarAlerta, mostrarMensaje } from "@Utils/functions"

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

class CV extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      urlFotoPerfil: '#'
    };
  }

  componentDidMount() {

    const datosUsuario = this.props.loggedUser.datos;

    var result = CordobaFilesUtils.getBase64Foto(datosUsuario.identificadorFotoPersonal, datosUsuario.sexoMasculino);

    result.then((imageBase64) => {
      this.setState({
        urlFotoPerfil: imageBase64
      });
    })
      .catch((imageBase64Defecto) => {
        this.setState({
          urlFotoPerfil: imageBase64Defecto
        });
      });
  }

  handleOnLoading = () => {
    this.props.mostrarCargando(true);
  }

  handleOnFinish = () => {
    this.props.mostrarCargando(false);
    mostrarMensaje("CV generado exitosamente, su archivo se descargará en unos segundos.");
  }

  handleOnError = (error) => {
    console.log("Error Descarga CV: " + error);
    mostrarAlerta('Ocurrió un error al intentar descargar el CV');
  }

  volverInicio = () => {
    this.props.redireccionar("/Inicio");
  }

  render() {
    const {
      urlFotoPerfil
    } = this.state;

    const {
      classes,
      loggedUser
    } = this.props;

    const datosUsuario = loggedUser.datos;
    // let urlFotoPerfil;
    // if (datosUsuario) {
    //   urlFotoPerfil = CordobaFilesUtils.getUrlFotoMediana(datosUsuario.identificadorFotoPersonal, datosUsuario.sexoMasculino);
    // }
    const fechaNacimiento = datosUsuario.fechaNacimiento && dateToString(new Date(datosUsuario.fechaNacimiento), 'DD/MM/YYYY') || '-'

    const estudiosRealizados = datosUsuario.estudios;
    let gruposNivelesEstudios = _.groupBy(estudiosRealizados, (o) => { return o.tipoEstudio });
    const experienciasLaborales = _.orderBy(datosUsuario.experienciasLaborales, ['fechaInicio', 'fechaFinalizacion'], ['desc', 'desc']);

    return (
      <React.Fragment>

        <Export
          buttonVover={
            <React.Fragment>
              <Button onClick={this.volverInicio} variant="outlined" color="primary" className={classes.button}>
                <Icon className={classNames(classes.iconoBotonAtras, classes.secondaryColor)}>arrow_back_ios</Icon>
                Atrás</Button>
            </React.Fragment>
          }
          fileName={'CV'} onLoading={this.handleOnLoading} onFinish={this.handleOnFinish} onError={this.handleOnError}>
          <Grid container>
            <Typography variant="title" className={classes.tituloCV}>Curriculum Vitae</Typography>
            <Grid item xs={12} sm={12} className={classes.widthHoja}>
              <Grid container>
                <Grid item xs={12} sm={8}>
                  <div className={classes.titlesContainer}>
                    <Typography variant="subheading" color="inherit" className={classes.usuario}>
                      {datosUsuario &&
                        datosUsuario.apellido + ', ' + datosUsuario.nombre}
                    </Typography>
                  </div>

                  {datosUsuario.email && <div className={classes.leftContainer}>
                    <Icon className={classes.iconoDetalle}>email</Icon>
                    <Typography variant="body1">
                      Email: {datosUsuario.email}
                    </Typography>
                  </div>}
                  {datosUsuario.dni && <div className={classes.leftContainer}>
                    <Icon className={classes.iconoDetalle}>account_box</Icon>
                    <Typography variant="body1">
                      DNI: {datosUsuario.dni}
                    </Typography>
                  </div>}
                  {datosUsuario.cuil && <div className={classes.leftContainer}>
                    <Icon className={classes.iconoDetalle}>account_box</Icon>
                    <Typography variant="body1">
                      CUIT: {datosUsuario.cuil}
                    </Typography>
                  </div>}
                  <div className={classes.leftContainer}>
                    <Icon className={classes.iconoDetalle}>wc</Icon>
                    <Typography variant="body1">
                      Sexo: {datosUsuario.sexoMasculino ? 'Masculino' : 'Femenino'}
                    </Typography>
                  </div>
                  {datosUsuario.fechaNacimiento && <div className={classes.leftContainer}>
                    <Icon className={classes.iconoDetalle}>insert_invitation</Icon>
                    <Typography variant="body1">
                      {fechaNacimiento} ({calcularEdad(fechaNacimiento)} años)</Typography>
                  </div>}
                  {datosUsuario.estadoCivilNombre && <div className={classes.leftContainer}>
                    <Icon className={classes.iconoDetalle}>people</Icon>
                    <Typography variant="body1">
                      Estado Civil: {datosUsuario.estadoCivilNombre}
                    </Typography>
                  </div>}
                  {datosUsuario.domicilioDireccion && <div className={classes.leftContainer}>
                    <Icon className={classes.iconoDetalle}>home</Icon>
                    <Typography variant="body1">
                      Domicilio Real: {datosUsuario.domicilioDireccion} {datosUsuario.domicilioAltura} {datosUsuario.domicilioPiso}{datosUsuario.domicilioDepto} {datosUsuario.domicilioTorre} {datosUsuario.domicilioCodigoPostal && '(Código Postal: ' + datosUsuario.domicilioCodigoPostal + ')'}
                    </Typography>
                  </div>}
                  {datosUsuario.domicilioLegal && <div className={classes.leftContainer}>
                    <Icon className={classes.iconoDetalle}>home</Icon>
                    <Typography variant="body1">
                      Domicilio Legal: {datosUsuario.domicilioLegal}
                    </Typography>
                  </div>}
                  {datosUsuario.domicilioBarrioNombre && <div className={classes.leftContainer}>
                    <Icon className={classes.iconoDetalle}>place</Icon>
                    <Typography variant="body1">
                      Barrio: {datosUsuario.domicilioBarrioNombre}
                    </Typography>
                  </div>}
                  {datosUsuario.domicilioCiudadNombre && <div className={classes.leftContainer}>
                    <Icon className={classes.iconoDetalle}>place</Icon>
                    <Typography variant="body1">
                      Ciudad: {datosUsuario.domicilioCiudadNombre}
                    </Typography>
                  </div>}
                  {datosUsuario.domicilioProvinciaNombre && <div className={classes.leftContainer}>
                    <Icon className={classes.iconoDetalle}>place</Icon>
                    <Typography variant="body1">
                      Provincia: {datosUsuario.domicilioProvinciaNombre}
                    </Typography>
                  </div>}
                  {datosUsuario.telefonoFijo && <div className={classes.leftContainer}>
                    <Icon className={classes.iconoDetalle}>phone</Icon>
                    <Typography variant="body1">
                      Telefono Fijo: {datosUsuario.telefonoFijo}
                    </Typography>
                  </div>}
                  {datosUsuario.telefonoCelular && <div className={classes.leftContainer}>
                    <Icon className={classes.iconoDetalle}>phone_iphone</Icon>
                    <Typography variant="body1">
                      Celular: {datosUsuario.telefonoCelular}
                    </Typography>
                  </div>}
                  {datosUsuario.cantidadHijos != null && datosUsuario.cantidadHijos > 0 && <div className={classes.leftContainer}>
                    <Icon className={classes.iconoDetalle}>child_friendly</Icon>
                    <Typography variant="body1">
                      Cantidad de Hijos: {datosUsuario.cantidadHijos}
                    </Typography>
                  </div>}
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Avatar alt="Menu del usuario" src={urlFotoPerfil} className={classNames(classes.icono)} />
                </Grid>
              </Grid>
            </Grid>

            <br /><br /><br /><br />
            <Grid item xs={12} sm={12}>
              <Grid container>

                {estudiosRealizados.length > 0 && <React.Fragment>
                  <Grid item xs={12} sm={8}>
                    <div className={classes.titlesContainer}>
                      <Typography variant="subheading" color="inherit" className={classes.usuario}>
                        Educación
                          </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={4}></Grid>

                  <Grid item xs={12} sm={8}>
                    <List className={classes.root}>
                      {Object.keys(gruposNivelesEstudios).reverse().map((value) => {

                        var idTipoEstudio = parseInt(value);

                        if (_.filter(gruposNivelesEstudios[idTipoEstudio], { tipoEstudio: idTipoEstudio }).length > 0) {

                          var lista = _.orderBy(gruposNivelesEstudios[idTipoEstudio], ['fechaFinalizacion', 'fechaInicio'], ['desc', 'desc']);
                          var tipoEstudio = _.find(arrayTipoEstudios, { value: idTipoEstudio });

                          return <React.Fragment>
                            <Typography variant="subheading" className={classes.tituloNivel}>
                              {tipoEstudio.label}
                            </Typography>
                            {lista.map((cardData, index) => {

                              return <React.Fragment>
                                <ListItem className={classNames(classes.listItem, classes.listItemEstudios)}>
                                  <ListItemText primary={(cardData.nombre || '') + (cardData.lugarDeCursado ? ' - ' + cardData.lugarDeCursado : '')} secondary={"Fecha Inicio: " + (cardData.fechaInicio ? cardData.fechaInicio : '-') + '/ Fecha Finalización: ' + (cardData.fechaFinalizacion ? cardData.fechaFinalizacion : '-')} />
                                </ListItem>
                              </React.Fragment>;
                            })}
                          </React.Fragment>;
                        }
                      })}
                    </List>
                  </Grid>
                  <Grid item xs={12} sm={4}></Grid>
                </React.Fragment>}

                {experienciasLaborales.length > 0 && <React.Fragment>
                  <Grid item xs={12} sm={8}>
                    <div className={classes.titlesContainer}>
                      <Typography variant="subheading" color="inherit" className={classes.usuario}>
                        Experiencia Laboral
                        </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={4}></Grid>

                  <Grid item xs={12} sm={8}>
                    {experienciasLaborales.map((expLab) => {
                      return <List className={classes.root}>
                        <ListItem className={classes.listItem}>
                          <ListItemText primary={expLab.cargo + ' - ' + expLab.nombre} secondary={"Fecha Inicio: " + (expLab.fechaInicio ? expLab.fechaInicio : '-') + '/ Fecha Finalización: ' + (expLab.fechaFinalizacion ? expLab.fechaFinalizacion : '-')} />
                        </ListItem>
                      </List>
                    })}
                  </Grid>
                  <Grid item xs={12} sm={4}></Grid>
                </React.Fragment>}

                {(datosUsuario.habilidades != null || datosUsuario.idiomas != null || datosUsuario.referencias  != null) && <React.Fragment>
                  <Grid item xs={12} sm={8}>
                    <div className={classes.titlesContainer}>
                      <Typography variant="subheading" className={classes.usuario}>
                        Datos Adicionales
                  </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={4}></Grid>
                </React.Fragment>}

                {datosUsuario.habilidades && <React.Fragment>
                  <Grid item xs={12} sm={8}>
                    <div className={classes.titlesContainer}>
                      <Typography variant="subheading" color="inherit" className={classes.tituloNivel}>
                        Habilidades
                          </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={4}></Grid>

                  <Grid item xs={12} sm={8}>
                    <Typography variant="body1" className={classes.texto}>
                      {datosUsuario.habilidades.split("\n").map(function (item) {
                        return (
                          <React.Fragment>{item}<br /></React.Fragment>
                        );
                      })}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}></Grid>
                </React.Fragment>}


                {datosUsuario.idiomas && <React.Fragment>
                  <Grid item xs={12} sm={8}>
                    <div className={classes.titlesContainer}>
                      <Typography variant="subheading" color="inherit" className={classes.tituloNivel}>
                        Idiomas
                          </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={4}></Grid>

                  <Grid item xs={12} sm={8}>
                    <Typography variant="body1" className={classes.texto}>
                      {datosUsuario.idiomas.split("\n").map(function (item) {
                        return (
                          <React.Fragment>{item}<br /></React.Fragment>
                        );
                      })}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}></Grid>
                </React.Fragment>}

                {datosUsuario.referencias && <React.Fragment>
                  <Grid item xs={12} sm={8}>
                    <div className={classes.titlesContainer}>
                      <Typography variant="subheading" color="inherit" className={classes.tituloNivel}>
                        Referencias
                          </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={4}></Grid>

                  <Grid item xs={12} sm={8}>
                    <Typography variant="body1" className={classes.texto}>
                      {datosUsuario.referencias.split("\n").map(function (item) {
                        return (
                          <React.Fragment>{item}<br /></React.Fragment>
                        );
                      })}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}></Grid>
                </React.Fragment>}

              </Grid>
            </Grid>

          </Grid>
        </Export>
      </React.Fragment>
    );
  }
}

const styles = theme => ({
  widthHoja: {
    width: '210mm'
  },
  centerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  leftContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  titlesContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '20px'
  },
  icono: {
    float: 'right',
    width: 200,
    height: 200,
  },
  iconoDetalle: {
    color: theme.color.block.main,
    margin: '4px'
  },
  iconoSvgDetalle: {
    width: '20px',
    height: '20px',
    color: theme.color.block.main,
    margin: '4px',
    fill: '#737373',
  },
  usuario: {
    fontSize: '1.5em',
    marginBottom: '4px'
  },
  texto: {
    padding: '0px 24px'
  },
  iconoBoton: {
    fontSize: '16px',
    lineHeight: '14px',
    marginRight: '4px',
  },
  secondaryColor: {
    color: theme.color.ok.main,
  },
  button: {
    marginTop: '6px'
  },
  listItem: {
    padding: '0px',
    paddingLeft: '2px',
  },
  listItemEstudios: {
    marginLeft: '16px'
  },
  tituloNivel: {
    fontSize: '18px',
    fontWeight: '500'
  },
  tituloCV: {
    fontSize: '25px',
    margin: '0px auto'
  }
});

let componente = CV;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
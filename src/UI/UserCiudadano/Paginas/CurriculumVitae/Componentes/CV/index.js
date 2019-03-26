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

import {arrayTipoEstudios} from '@DatosEstaticos/EstudiosRealizados.js'

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
    console.log("Error Descarga CV: "+error);
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

    const estudiosRealizados = _.orderBy(datosUsuario.estudios, ['tipoEstudio'], ['desc']);
    const experienciasLaborales = _.orderBy(datosUsuario.experienciasLaborales, ['fechaInicio', 'fechaFinalizacion'], ['desc','desc']);

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
                    {datosUsuario.fechaNacimiento && <div className={classes.leftContainer}>
                      <Icon className={classes.iconoDetalle}>insert_invitation</Icon>
                      <Typography variant="body1">
                        {fechaNacimiento} ({calcularEdad(fechaNacimiento)} años)</Typography>
                    </div>}
                    <div className={classes.leftContainer}>
                    <div className={classes.iconoSvgDetalle}>
                      <svg viewBox="0 0 512 512">
                      <path d="M403.921,0v31.347h35.36l-68.982,65.409c-24.421-24.99-58.474-40.53-96.092-40.53c-50.603,0-94.759,28.112-117.687,69.535
                    c-1.964-0.086-3.938-0.138-5.924-0.138c-74.118,0-134.417,60.299-134.417,134.418c0,68.816,51.984,125.71,118.743,133.498v41.657
                    H87.995v31.347h46.929V512h31.347v-45.458h48.977v-31.347h-48.977v-41.657c43.948-5.127,81.488-31.533,102.013-68.616
                    c1.964,0.086,3.937,0.138,5.922,0.138c74.119,0,134.418-60.299,134.418-134.417c0-25.187-6.969-48.774-19.071-68.944
                    l74.919-71.038v38.933h31.347V0H403.921z M150.598,363.11c-56.833,0-103.07-46.237-103.07-103.071
                    c0-54.619,42.705-99.442,96.477-102.853c-2.751,10.7-4.215,21.91-4.215,33.457c0,60.464,40.132,111.726,95.157,128.562
                    C216.281,345.738,185.432,363.11,150.598,363.11z M249.044,290.6c-44.709-11.26-77.906-51.802-77.906-99.957
                    c0-10.636,1.62-20.901,4.625-30.561c44.709,11.26,77.906,51.803,77.906,99.958C253.669,270.676,252.048,280.94,249.044,290.6z
                    M280.801,293.495c2.751-10.7,4.215-21.909,4.215-33.456c0-60.464-40.132-111.726-95.156-128.563
                    c18.666-26.532,49.516-43.905,84.349-43.905c56.834,0,103.071,46.237,103.071,103.071
                    C377.278,245.261,334.573,290.085,280.801,293.495z"/></svg></div>
                      <Typography variant="body1">
                        Sexo: {datosUsuario.sexoMasculino ? 'Masculino' : 'Femenino'}
                      </Typography>
                    </div>
                    {datosUsuario.cantidadHijos && <div className={classes.leftContainer}>
                      <Icon className={classes.iconoDetalle}>child_friendly</Icon>
                      <Typography variant="body1">
                        Cantidad de Hijos: {datosUsuario.cantidadHijos}
                      </Typography>
                    </div>}
                    {datosUsuario.domicilioLegal && <div className={classes.leftContainer}>
                      <Icon className={classes.iconoDetalle}>home</Icon>
                      <Typography variant="body1">
                        Domicilio Legal: {datosUsuario.domicilioLegal}
                      </Typography>
                    </div>}
                    {datosUsuario.domicilioDireccion && <div className={classes.leftContainer}>
                      <Icon className={classes.iconoDetalle}>home</Icon>
                      <Typography variant="body1">
                        Domicilio Actual: {datosUsuario.domicilioDireccion} {datosUsuario.domicilioAltura} {datosUsuario.domicilioPiso}{datosUsuario.domicilioDepto} {datosUsuario.domicilioTorre} {datosUsuario.domicilioCodigoPostal && '(Código Postal: '+datosUsuario.domicilioCodigoPostal+')'}
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
                        Ciudad: {datosUsuario.domicilioCiudadNombre} {datosUsuario.domicilioProvinciaNombre}
                      </Typography>
                    </div>}
                    {datosUsuario.estadoCivilNombre && <div className={classes.leftContainer}>
                    <div className={classes.iconoSvgDetalle}>
                      <svg viewBox="0 0 466 466">
                        <path d="M291.771,16c42.264,0,81.999,16.459,111.884,46.344C433.541,92.23,450,131.965,450,174.229
                          c0,42.264-16.459,81.999-46.345,111.885c-29.885,29.885-69.62,46.344-111.884,46.344c-42.265,0-82-16.459-111.885-46.344
                          c-21.798-21.798-36.652-49.191-42.956-79.218c-0.907-4.324-5.149-7.098-9.473-6.186c-4.324,0.908-7.094,5.149-6.186,9.473
                          c6.943,33.075,23.3,63.244,47.3,87.244c32.907,32.908,76.66,51.031,123.199,51.031c46.538,0,90.291-18.123,123.198-51.031
                          c32.907-32.907,51.03-76.66,51.03-123.198c0-46.539-18.123-90.292-51.03-123.199C382.063,18.123,338.31,0,291.771,0
                          c-46.539,0-90.292,18.123-123.199,51.03c-20.553,20.553-35.652,45.922-43.856,73.61c-27.555,8.123-52.805,23.051-73.686,43.932
                          C18.123,201.479,0,245.232,0,291.771c0,46.539,18.123,90.292,51.03,123.199C83.938,447.877,127.69,466,174.229,466
                          c46.539,0,90.292-18.123,123.199-51.03c12.786-12.787,23.438-27.342,31.661-43.263c2.027-3.926,0.488-8.751-3.438-10.779
                          c-3.924-2.027-8.752-0.489-10.779,3.437c-7.464,14.453-17.14,27.672-28.759,39.291C256.229,433.541,216.493,450,174.229,450
                          c-42.264,0-81.999-16.459-111.884-46.344C32.459,373.77,16,334.035,16,291.771c0-42.264,16.459-81.999,46.345-111.885
                          c19.769-19.769,43.848-33.663,70.118-40.804c0.524-0.085,1.036-0.222,1.527-0.407c12.976-3.387,26.474-5.133,40.238-5.133
                          c0.749,0,1.493,0.005,2.239,0.016c0.26,0.017,0.52,0.02,0.775,0.013c41.137,0.763,79.696,17.142,108.87,46.316
                          c27.899,27.899,44.162,64.579,46.141,103.797c-8.154,3.011-16.666,5.104-25.402,6.225c-0.498-34.387-14.375-67.468-38.833-91.926
                          c-25.052-25.052-58.36-38.849-93.79-38.849c-35.429,0-68.737,13.797-93.789,38.849c-51.715,51.715-51.715,135.862,0,187.578
                          c25.052,25.052,58.36,38.849,93.789,38.849c35.43,0,68.738-13.797,93.79-38.849c3.55-3.551,6.926-7.327,10.031-11.225
                          c2.754-3.455,2.186-8.488-1.27-11.242c-3.456-2.752-8.489-2.186-11.242,1.271c-2.733,3.43-5.706,6.755-8.834,9.883
                          c-22.029,22.03-51.32,34.162-82.476,34.162c-31.154,0-60.445-12.132-82.475-34.162c-45.478-45.478-45.478-119.474,0-164.951
                          c22.029-22.03,51.32-34.163,82.475-34.163c31.155,0,60.446,12.133,82.476,34.163c21.681,21.68,33.905,51.067,34.157,81.568
                          c-30.814-0.234-59.751-12.344-81.565-34.159c-16.713-16.713-27.835-37.776-32.165-60.913c-0.813-4.342-4.988-7.209-9.335-6.392
                          c-4.343,0.813-7.204,4.992-6.392,9.335c4.926,26.321,17.573,50.278,36.577,69.283c25.052,25.052,58.36,38.849,93.79,38.849
                          c35.429,0,68.737-13.797,93.789-38.849c51.715-51.715,51.715-135.862,0-187.578c-25.052-25.052-58.36-38.849-93.789-38.849
                          c-35.43,0-68.738,13.797-93.79,38.849c-10.889,10.889-19.675,23.355-26.171,37.118c-9.768,0.132-19.403,1.063-28.837,2.762
                          c7.858-21.683,20.461-41.524,36.913-57.976C209.771,32.459,249.507,16,291.771,16z M209.296,91.753
                          c22.029-22.03,51.32-34.162,82.476-34.162c31.154,0,60.445,12.132,82.475,34.162c45.478,45.478,45.478,119.474,0,164.951
                          c-7.951,7.952-16.852,14.615-26.441,19.883c-3.521-40.812-21.149-78.788-50.377-108.016c-29.296-29.296-67.191-46.875-107.992-50.38
                          C194.729,108.529,201.381,99.669,209.296,91.753z"/>
                        </svg>
                      </div>
                      <Typography variant="body1">
                        Estado Civil: {datosUsuario.estadoCivilNombre}
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
                        {estudiosRealizados.map((estudio) => {
                          let nombreNivelEd = '';

                          try {
                            nombreNivelEd = _.find(arrayTipoEstudios, {value: parseInt(estudio.tipoEstudio)}).label;
                          } catch (error) {}

                          return <List className={classes.root}>
                            <ListItem className={classes.listItem}>
                              <ListItemText primary={estudio.nombre + ' - ' + nombreNivelEd} secondary={"Fecha Inicio: " + (estudio.fechaInicio ? estudio.fechaInicio : '-') + '/ Fecha Finalización: ' + (estudio.fechaFinalizacion ? estudio.fechaFinalizacion : '-')} />
                            </ListItem>
                          </List>
                        })}
                    </Grid>
                    <Grid id item xs={12} sm={4}></Grid>
                    </React.Fragment>}

                    {datosUsuario.habilidades && <React.Fragment>
                      <Grid item xs={12} sm={8}>
                        <div className={classes.titlesContainer}>
                          <Typography variant="subheading" color="inherit" className={classes.usuario}>
                            Habilidades
                          </Typography>
                        </div>
                      </Grid>
                      <Grid item xs={12} sm={4}></Grid>
                    
                      <Grid item xs={12} sm={8}>
                        <Typography variant="body1" className={classes.texto}>
                          {datosUsuario.habilidades.split("\n").map(function(item) {
                            return (
                              <React.Fragment>{item}<br/></React.Fragment>
                            );
                          })}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}></Grid>
                    </React.Fragment>}


                    {datosUsuario.idiomas && <React.Fragment>
                      <Grid item xs={12} sm={8}>
                        <div className={classes.titlesContainer}>
                          <Typography variant="subheading" color="inherit" className={classes.usuario}>
                            Idiomas
                          </Typography>
                        </div>
                      </Grid>
                      <Grid item xs={12} sm={4}></Grid>
                    
                      <Grid item xs={12} sm={8}>
                        <Typography variant="body1" className={classes.texto}>
                          {datosUsuario.idiomas.split("\n").map(function(item) {
                            return (
                              <React.Fragment>{item}<br/></React.Fragment>
                            );
                          })}
                        </Typography>
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

                    {datosUsuario.referencias && <React.Fragment>
                      <Grid item xs={12} sm={8}>
                        <div className={classes.titlesContainer}>
                          <Typography variant="subheading" color="inherit" className={classes.usuario}>
                            Referencias
                          </Typography>
                        </div>
                      </Grid>
                      <Grid item xs={12} sm={4}></Grid>
                    
                      <Grid item xs={12} sm={8}>
                        <Typography variant="body1" className={classes.texto}>
                          {datosUsuario.referencias.split("\n").map(function(item) {
                            return (
                              <React.Fragment>{item}<br/></React.Fragment>
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
  }
});

let componente = CV;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(componente));
componente = withRouter(componente);
export default componente;
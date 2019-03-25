import React from "react";
import _ from "lodash";

//Mobile
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";

//Styles
import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core/styles";
import "./style.css";

//Router
import { withRouter } from "react-router-dom";
import { Route, Redirect } from "react-router-dom";
import { AnimatedSwitch } from "react-router-transition";
import { replace } from "connected-react-router";

//URL Search (IE11)
import 'url-search-params-polyfill';

//REDUX
import { connect } from "react-redux";
import { ocultarAlerta } from "@Redux/Actions/alerta";
import { login, logout } from '@Redux/Actions/usuario';
import { setAplicacionPanel, paraMobile } from '@Redux/Actions/mainContent';

//Componentes
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import { IconButton, Icon } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

//Mis componentes
import InicioCiudadano from "./UserCiudadano/Inicio";
import InicioGestor from "./UserGestor/Inicio";
import Pagina404 from "@UI/_Pagina404";
import IndicadorCargando from "@UI/_Componentes/IndicadorCargando"
import MiSoporteUsuario from "@UI/_Componentes/MiSoporteUsuario"

import Rules_Usuario from "@Rules/Rules_Usuario";
import Rules_VecinoVirtual from '@Rules/Rules_VecinoVirtual';
import { dateToString } from "@Utils/functions";

const mapStateToProps = state => {
  return {
    alertas: state.Alerta.alertas,
    loggedUser: state.Usuario.loggedUser
  };
};

const mapDispatchToProps = dispatch => ({
  onAlertaClose: id => {
    dispatch(ocultarAlerta(id));
  },
  login: (data) => {
    dispatch(login(data));
  },
  logout: () => {
    dispatch(logout());
  },
  redireccionar: url => {
    dispatch(replace(url));
  },
  setAplicacionPanel: data => {
    dispatch(setAplicacionPanel(data));
  },
  paraMobile: data => {
    dispatch(paraMobile(data));
  }
});

const limite = 'sm';
class App extends React.Component {
  constructor(props) {
    super(props);

    const paraMobile = !isWidthUp(limite, props.width);
    this.props.paraMobile(paraMobile);

    this.state = {
      validandoToken: false,
      cargandoVisible: true
    };
  }

  componentWillMount() {

    //Seteo Token en cookies // para salir del apuro asumimos que siempre viene
    /*const tokenParam = getAllUrlParams(window.location.href).Token;
    tokenParam && localStorage.setItem('token', tokenParam);

    const token = localStorage.getItem('token');

    if(!token) window.location.href = "https://servicios2.cordoba.gov.ar/AutogestionTributaria/vecino-virtual.html";

    this.props.login({
      token: token
    });

    //Traemos datos de usuario para guardarlos en las props de redux
    services.getDatosUsuario(token) //this.props.loggedUser.token
      .then((datos) => {
        
        //Seteamos las props
        this.props.login({
          datos: datos.return
        });

      });*/
  }

  componentDidMount() {

    this.init(() => {
      this.setState({ cargandoVisible: false }, () => {
        let token = localStorage.getItem("token");

        let search = this.props.location.search;
        if (search.charAt(0) == "?") {
          search = search.substring(1);
          search = new URLSearchParams(search);
          let tokenQueryString = search.get("token");
          if (tokenQueryString) {
            token = tokenQueryString;
          }
        }

        this.setState({ validandoToken: true }, () => {
          Rules_VecinoVirtual.validarToken(token)
            .then(resultado => {
              if (resultado == false) {
                this.props.logout();
                window.location.href = window.Config.URL_LOGIN + "?url=" + this.props.location.pathname + this.props.location.search;
                return;
              }

              Rules_Usuario.getInfoUsuario(token)
                .then(datos => {

                  const listaExperienciaLaboral = datos.experienciasLaborales;
                  listaExperienciaLaboral.map((item, index) => {
                    if (item.id) return true; //Cuando ya se seteo el ID no se deberá a realizar este proceso

                    const randomId = "id_" + index + "_" + (new Date()).getTime() + parseInt(1 + Math.random() * (10 - 1));

                    item.fechaInicio = item.fechaInicio ? dateToString(new Date(item.fechaInicio), 'DD/MM/YYYY') : '';
                    item.fechaFinalizacion = item.fechaFinalizacion ? dateToString(new Date(item.fechaFinalizacion), 'DD/MM/YYYY') : '';
                    item.id = randomId;
                  });

                  let listaEstudiosRealizados = datos.estudios;
                  listaEstudiosRealizados.map((item, index) => {
                    if (item.id) return true; //Cuando ya se seteo el ID no se deberá a realizar este proceso

                    const randomId = "id_" + index + "_" + (new Date()).getTime() + parseInt(1 + Math.random() * (10 - 1));

                    item.fechaInicio = item.fechaInicio ? dateToString(new Date(item.fechaInicio), 'DD/MM/YYYY') : '';
                    item.fechaFinalizacion = item.fechaFinalizacion ? dateToString(new Date(item.fechaFinalizacion), 'DD/MM/YYYY') : '';
                    item.id = randomId;
                  });

                  Rules_Usuario.getDatosExtrasUsuario(token)
                    .then(datosExtras => {

                      this.getRolUser(token, (esGestor) => {
                        this.props.login({
                          datos: {
                            ...datos,
                            ...datosExtras
                          },
                          token: token,
                          esGestor: esGestor
                        });

                        const estudioAlcanzadoNoConfig = !datos.estudioAlcanzadoId;
                        if (estudioAlcanzadoNoConfig) {
                          window.location.href = window.Config.URL_MI_PERFIL + "/#/?token=" + token + '&seccion=datosExtra&seccionMensaje=Debe completar los datos de "Datos Adicionales" para poder inscribirse a los programas Si Estudio, Si Trabajo. Recuerde que al terminar, no olvide guardar los cambios.&redirect=' + encodeURIComponent(window.Config.URL_ROOT + '/Inicio');
                          return false;
                        }

                        const numeroTramiteNoConfig = !datos.validacionNumeroTramite;
                        if (numeroTramiteNoConfig) {
                          window.location.href = window.Config.URL_MI_PERFIL + "/#/?token=" + token + '&seccion=datosValidacion&seccionMensaje=Debe completar los datos de "Validación de número de trámite de DNI" para poder inscribirse a los programas Si Estudio, Si Trabajo. Recuerde que al terminar, no olvide guardar los cambios.&redirect=' + encodeURIComponent(window.Config.URL_ROOT + '/Inicio');
                          return false;
                        }

                        //let url = "/";
                        if (search) {
                          let url = search.get("url") || "/";
                          if (url == "/") url = "/Inicio";
                          this.props.redireccionar(url);
                        } else {
                          console.log(this.props.location);

                          if (this.props.location.pathname == "/") {
                            this.props.redireccionar("/Inicio");
                          }
                        }

                        this.onLogin();
                      });
                    })
                    .catch(() => {
                      this.props.logout();
                      window.location.href = window.Config.URL_LOGIN + "?url=" + this.props.location.pathname + this.props.location.search;
                    });
                })
                .catch(() => {
                  this.props.logout();
                  window.location.href = window.Config.URL_LOGIN + "?url=" + this.props.location.pathname + this.props.location.search;
                });

              this.setState({ validandoToken: false });
            })
            .catch(error => {
              this.props.logout();
              window.location.href = window.Config.URL_LOGIN + "?url=" + this.props.location.pathname + this.props.location.search;

              this.setState({ validandoToken: false });
            });
        });
      });
    });
  }

  init = (callback) => {
    const service = Rules_VecinoVirtual.AplicacionPanel()
      .then(datos => {
        this.props.setAplicacionPanel(datos);
      })
      .catch(error => {
        console.log(error);
      });

    Promise.all([service]).then(() => {
      callback();
    });
  }

  getRolUser = (token, callback) => {
    Rules_VecinoVirtual.getRol(token)
      .then(datos => {
        var result = undefined;
        if (datos instanceof Array) {
          result = _.find(datos, { id: 2162 });
        }

        if (result)
          callback(true);
        else
          callback(false);
      })
      .catch(error => {
        console.log(error);
        callback(false);
      });
  }

  onResize = () => {
    setTimeout(() => {
      const paraMobile = !isWidthUp(limite, this.props.width);
      this.props.paraMobile(paraMobile);
    }, 500);
  };

  onLogin = () => {
    //Cada 5 seg valido el token
    this.intervalo = setInterval(() => {
      let token = localStorage.getItem("token");
      if (token == undefined || token == null || token == "undefined") {
        this.props.logout();
        window.location.href = window.Config.URL_LOGIN + "?url=" + this.props.location.pathname + this.props.location.search;
        return;
      }

      Rules_VecinoVirtual.validarToken(token)
        .then(resultado => {
          if (resultado == false) {
            this.props.logout();
            window.location.href = window.Config.URL_LOGIN + "?url=" + this.props.location.pathname + this.props.location.search;
            return;
          }
        })
        .catch(error => {
          this.props.logout();
          window.location.href = window.Config.URL_LOGIN + "?url=" + this.props.location.pathname + this.props.location.search;
        });
    }, 5000);
  };

  componentWillUnmount() {
    this.intervalo && clearInterval(this.intervalo);
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        {this.renderContent()}
        {this.renderAlertas()}
      </div>
    );
  }

  renderContent() {
    const { classes } = this.props;
    const { cargandoVisible } = this.state;

    let base = "";
    const login = this.state.validandoToken == false && this.props.loggedUser != undefined;

    return (
      <main className={classes.content}>
        <IndicadorCargando visible={cargandoVisible} />
        <MiSoporteUsuario />
        <AnimatedSwitch
          atEnter={{ opacity: 0 }}
          atLeave={{ opacity: 0 }}
          atActive={{ opacity: 1 }}
          className={"switch-wrapper"}
        >
          <Route exact path="/" component={null} />
          <Route path={`${base}/Inicio`} component={login ? InicioCiudadano : null} />
          <Route path={`${base}/InicioGestor`} component={login ? InicioGestor : null} />
          <Route component={login ? Pagina404 : null} />
        </AnimatedSwitch>
      </main>
    );
  }

  renderAlertas() {
    const { classes } = this.props;

    return this.props.alertas.map((alerta, index) => {
      return (
        <Snackbar
          key={alerta.id}
          key={index}
          open={alerta.visible}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          autoHideDuration={5000}
          onClose={() => {
            this.props.onAlertaClose(alerta.id);
          }}
          ContentProps={{
            "aria-describedby": "message-id" + alerta.id
          }}
        >
          <SnackbarContent
            style={{ backgroundColor: alerta.color }}
            aria-describedby="client-snackbar"
            message={
              <span
                id={"message-id" + alerta.id}
                className={classes.snackMessage}
              >
                {alerta.icono != undefined && (
                  <Icon className={classes.snackCustomIcon}>
                    {alerta.icono}
                  </Icon>
                )}
                {alerta.texto}
              </span>
            }
            action={[
              alerta.mostrarIconoCerrar && (
                <IconButton
                  key="close"
                  aria-label="Close"
                  color="inherit"
                  onClick={() => {
                    this.props.onAlertaClose(alerta.id);
                  }}
                >
                  <CloseIcon className={classes.icon} />
                </IconButton>
              )
            ]}
          />
        </Snackbar>
      );
    });
  }
}

const styles = theme => {
  return {
    root: {
      display: "flex",
      height: "100vh",
      overflow: "hidden"
    },
    content: {
      display: "flex",
      flexGrow: 1,
      overflow: "auto",
      overflow: "hidden"
    },
    icon: {
      fontSize: 20
    },
    snackCustomIcon: {
      marginRight: theme.spacing.unit
    },
    snackMessage: {
      display: "flex",
      alignItems: "center"
    }
  };
};

let componente = App;
componente = withStyles(styles)(componente);
componente = withWidth()(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;

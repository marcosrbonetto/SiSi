import _ from "lodash";

import Store from "@Redux/Store/index";
import { setStateAccess } from "@ReduxSrc/CaptchaAccess/actions";

const metodos = {
  validarToken: token => {
    const url = window.Config.BASE_URL_WS + "/v1/Usuario/ValidarToken";
    //Este valor se obtiene luego de pasar la prueba del ReCaptcha
    const accessCaptcha = Store.getState().CaptchaAccess.accessCaptcha || '-';
    //const estadoAccesoWS = Store.getState().CaptchaAccess.estadoAccesoWS || true;

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
        headers: {
          "--ControlAcceso": accessCaptcha,
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Token": token
        }
      })
        .then(data => data.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error);
            return;
          }

          if (data.accesoWS)
            resolve(data.return);
          else {
            const estadoAccesoWS = Store.getState().CaptchaAccess.estadoAccesoWS || true;
            if (window.location.hash.substring(1).indexOf('CaptchaAccess') == -1 && estadoAccesoWS) { Store.dispatch(setStateAccess(false)); };
          }
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  datos: token => {
    const url = window.Config.BASE_URL_WS + "/v1/Usuario/Usuario";
    //Este valor se obtiene luego de pasar la prueba del ReCaptcha
    const accessCaptcha = Store.getState().CaptchaAccess.accessCaptcha || '-';
    //const estadoAccesoWS = Store.getState().CaptchaAccess.estadoAccesoWS || true;

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
        headers: {
          "--ControlAcceso": accessCaptcha,
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Token": token
        }
      })
        .then(data => data.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error);
            return;
          }

          if (data.accesoWS)
            resolve(data.return);
          else {
            const estadoAccesoWS = Store.getState().CaptchaAccess.estadoAccesoWS || true;
            if (window.location.hash.substring(1).indexOf('CaptchaAccess') == -1 && estadoAccesoWS) { Store.dispatch(setStateAccess(false)); };
          }
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  }
};

export default metodos;
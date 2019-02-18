import Store from "@Redux/Store/index";
import { setStateAccess } from "@ReduxSrc/CaptchaAccess/actions";

const getMisNotificaciones = (token) => {
    //Este valor se obtiene luego de pasar la prueba del ReCaptcha
    const accessCaptcha = Store.getState().CaptchaAccess.accessCaptcha || '-';
    //const estadoAccesoWS = Store.getState().CaptchaAccess.estadoAccesoWS || true;

    return new Promise((resolve, reject) => {

        fetch(window.Config.BASE_URL_WS + '/v1/Notificacion/MisNotificaciones', {
            method: "GET",
            headers: {
                "--ControlAcceso": accessCaptcha,
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Token": token
            }
        })
            .then(res => {

                if (res.status >= 400) {
                    throw new Error("Bad response from server");
                }

                return res.json();
            })
            .then(datos => {
                if (datos.accesoWS)
                    resolve(datos);
                else {
                    const estadoAccesoWS = Store.getState().CaptchaAccess.estadoAccesoWS || true;
                    if (window.location.hash.substring(1).indexOf('CaptchaAccess') == -1 && estadoAccesoWS) { Store.dispatch(setStateAccess(false)); };
                }
            })
            .catch(err => {
                reject("Error procesando la solicitud");
            });
    });
};

const setNotificacionLeida = (token, identificador) => {
    //Este valor se obtiene luego de pasar la prueba del ReCaptcha
    const accessCaptcha = Store.getState().CaptchaAccess.accessCaptcha || '-';
    //const estadoAccesoWS = Store.getState().CaptchaAccess.estadoAccesoWS || true;

    return new Promise((resolve, reject) => {

        fetch(window.Config.BASE_URL_WS + '/v1/Notificacion/Leer?identificador=' + identificador, {
            method: "GET",
            headers: {
                "--ControlAcceso": accessCaptcha,
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Token": token
            }
        })
            .then(res => {

                if (res.status >= 400) {
                    throw new Error("Bad response from server");
                }

                return res.json();
            })
            .then(datos => {
                if (datos.accesoWS)
                    resolve(datos);
                else {
                    const estadoAccesoWS = Store.getState().CaptchaAccess.estadoAccesoWS || true;
                    if (window.location.hash.substring(1).indexOf('CaptchaAccess') == -1 && estadoAccesoWS) { Store.dispatch(setStateAccess(false)); };
                }
            })
            .catch(err => {
                reject("Error procesando la solicitud");
            });
    });
};

const services = {
    getMisNotificaciones: getMisNotificaciones,
    setNotificacionLeida: setNotificacionLeida
}

export default services;
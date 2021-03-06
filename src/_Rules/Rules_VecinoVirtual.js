import _ from "lodash";

const metodos = {
  AplicacionPanel: () => {
    const url = window.Config.VV_URL_WS + "/v2/AplicacionPanel";

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        }
      })
        .then(data => data.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error);
            return;
          }

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  validarToken: (token) => {
    const url = window.Config.BASE_URL_WS + "/v1/VecinoVirtual/ValidarToken";

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
        headers: {
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

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  getRol: (token) => {
    const url = window.Config.BASE_URL_WS + "/v1/VecinoVirtual/GetRol";

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
        headers: {
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

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  }
};

export default metodos;
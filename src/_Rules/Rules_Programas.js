const getProgramas = (token) => {

    return new Promise((resolve, reject) => {

        fetch(window.Config.BASE_URL_WS + '/v1/Programa/GetAll', {
            method: "GET",
            headers: {
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
                resolve(datos);
            })
            .catch(err => {
                reject("Error procesando la solicitud");
            });
    });
};

const getProgramasVirtuales = (token) => {

    return new Promise((resolve, reject) => {

        fetch(window.Config.BASE_URL_WS + '/v1/Programa/GetProgramasVirtualesActivos', {
            method: "GET",
            headers: {
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
                resolve(datos);
            })
            .catch(err => {
                reject("Error procesando la solicitud");
            });
    });
};

const updatePrograma = (token, body) => {

    return new Promise((resolve, reject) => {
        fetch(window.Config.BASE_URL_WS + '/v1/Programa/Modificar', {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Token": token
            },
            body: JSON.stringify(body)
        })
            .then(res => {

                if (res.status >= 400) {
                    throw new Error("Bad response from server");
                }

                return res.json();
            })
            .then(datos => {
                resolve(datos);
            })
            .catch(err => {
                reject("Error procesando la solicitud");
            });
    });
};

const services = {
    getProgramas: getProgramas,
    getProgramasVirtuales: getProgramasVirtuales,
    updatePrograma: updatePrograma
}

export default services;
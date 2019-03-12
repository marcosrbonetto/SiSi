const getPreinsciptos = (token, body) => {

    return new Promise((resolve, reject) => {
        fetch(window.Config.BASE_URL_WS + '/v1/Reporte/Preinscriptos', {
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

const deletePreinscripcion = (token, idUsuario) => {

    return new Promise((resolve, reject) => {
        fetch(window.Config.BASE_URL_WS + '/v1/Reporte/BorrarPreinscripcion?idUsuario='+idUsuario, {
            method: "DELETE",
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

const getProgramasYCursos = (token) => {

    return new Promise((resolve, reject) => {

        fetch(window.Config.BASE_URL_WS + '/v1/Reporte/GetProgramasYCursos', {
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

const services = {
    getPreinsciptos: getPreinsciptos,
    deletePreinscripcion: deletePreinscripcion,
    getProgramasYCursos: getProgramasYCursos
}

export default services;
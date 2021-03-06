const getPreinsciptosPaginados = (token, body) => {

    return new Promise((resolve, reject) => {
        fetch(window.Config.BASE_URL_WS + '/v1/Reporte/PreinscriptosPaginados', {
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

const deletePreinscripcion = (token, body) => {

    return new Promise((resolve, reject) => {
        fetch(window.Config.BASE_URL_WS + '/v1/Reporte/BorrarPreinscripcion', {
            method: "DELETE",
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

const cerrarCurso = (token, idCurso) => {

    return new Promise((resolve, reject) => {
        fetch(window.Config.BASE_URL_WS + '/v1/Reporte/CerrarCurso', {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Token": token
            },
            body: JSON.stringify({
                id: idCurso
            })
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

const activarCurso = (token, idCurso) => {

    return new Promise((resolve, reject) => {
        fetch(window.Config.BASE_URL_WS + '/v1/Reporte/ActivarCurso', {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Token": token
            },
            body: JSON.stringify({
                id: idCurso
            })
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

const cerrarPrograma = (token, idPrograma) => {

    return new Promise((resolve, reject) => {
        fetch(window.Config.BASE_URL_WS + '/v1/Reporte/CerrarPrograma?id=' + idPrograma, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Token": token
            },
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

const activarPrograma = (token, idPrograma) => {

    return new Promise((resolve, reject) => {
        fetch(window.Config.BASE_URL_WS + '/v1/Reporte/ActivarPrograma?id=' + idPrograma, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Token": token
            },
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

const getCursos = (token, body) => {

    return new Promise((resolve, reject) => {
        fetch(window.Config.BASE_URL_WS + '/v1/Reporte/GetCursos', {
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

const reInscribir = (token, body) => {

    return new Promise((resolve, reject) => {
        fetch(window.Config.BASE_URL_WS + '/v1/Reporte/ReInscribir', {
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

const exportarPreinscriptos = (token, body) => {

    return new Promise((resolve, reject) => {
        fetch(window.Config.BASE_URL_WS + '/v1/Reporte/ExportarPreinscriptos', {
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

const asignarAulas = (token, body) => {

    return new Promise((resolve, reject) => {
        fetch(window.Config.BASE_URL_WS + '/v1/Reporte/AsignarAulas', {
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

const getAulas = (token, idCurso) => {

    return new Promise((resolve, reject) => {

        fetch(window.Config.BASE_URL_WS + '/v1/Reporte/GetAulas?idCurso='+idCurso, {
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


const exportarInscripcionesAlCampusVirtual  = (token, body) => {
    
    return new Promise((resolve, reject) => {
        fetch(window.Config.BASE_URL_WS + '/v1/Reporte/ExportarInscripcionesAlCampusVirtual ', {
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

const habilitarInscripcionAulaVirtual = (token, body) => {

    return new Promise((resolve, reject) => {
        fetch(window.Config.BASE_URL_WS + '/v1/Reporte/HabilitarInscripcionAulaVirtual', {
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
    getPreinsciptosPaginados: getPreinsciptosPaginados,
    getPreinsciptos: getPreinsciptos,
    deletePreinscripcion: deletePreinscripcion,
    getProgramasYCursos: getProgramasYCursos,
    cerrarCurso: cerrarCurso,
    activarCurso: activarCurso,
    cerrarPrograma: cerrarPrograma,
    activarPrograma: activarPrograma,
    getCursos: getCursos,
    reInscribir: reInscribir,
    exportarPreinscriptos: exportarPreinscriptos,
    asignarAulas: asignarAulas,
    getAulas: getAulas,
    exportarInscripcionesAlCampusVirtual : exportarInscripcionesAlCampusVirtual ,
    habilitarInscripcionAulaVirtual: habilitarInscripcionAulaVirtual,
}

export default services;
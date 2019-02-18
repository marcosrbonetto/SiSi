import _ from "lodash";

const storePersistent = {
    getStorePersistent : (params) => { //Agrega al initialState lo que se seteo como permanente
        let DetalleTributario = {};
    
        if (localStorage.getItem(params.reducer)) {
            try {
    
                DetalleTributario = JSON.parse(localStorage.getItem(params.reducer));
    
                _.each(Object.keys(params.state), (infoSeccion, index) => {
                    if (DetalleTributario[infoSeccion])
                        params.state[infoSeccion] = DetalleTributario[infoSeccion];
                });
    
                return params.state;
            } catch (e) {
                console.log("[TO] Error al convertir el DetalleTributario a JSON")
                return params.state;
            }
        } else {
            return params.state;
        }
    },
    setStorePersistent : (params) => { //Persiste los datos para que no se pierdan al actualizar la página
        if (localStorage.getItem(params.reducer)) {
            localStorage.setItem(params.reducer, JSON.stringify({
                ...JSON.parse(localStorage.getItem(params.reducer)),
                [params.sectionReducer]: params.info
            }));
        } else {
            localStorage.setItem(params.reducer, JSON.stringify({
                [params.sectionReducer]: params.info
            }));
        }

        return Object.assign({ ...params.state }, params.state[params.sectionReducer], {
            [params.sectionReducer]: params.info
        });
    }
}

export default storePersistent;
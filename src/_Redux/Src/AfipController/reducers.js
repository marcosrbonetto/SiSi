import {
    SET_TRIBUTO_BIENES_CUIT
} from "@ReduxSrc/AfipController/constants";

import storePersistent from "@Redux/Store/persistent";

let initialState = {
    tributosBienesPorCUIT: [],
};

//Agrega al initialState lo que se seteo como permanente
initialState = storePersistent.getStorePersistent({
    reducer: 'DetalleTributario',
    state: initialState
});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TRIBUTO_BIENES_CUIT: {
            return Object.assign({ ...state }, state.tributosBienesPorCUIT, {
                tributosBienesPorCUIT: action.payload
            });
        }
        default:
            return state;
    }
};
export default reducer;

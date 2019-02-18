import {
    SET_ACCESS_CAPTCHA,
    SET_STATE_ACCESS
} from "@ReduxSrc/CaptchaAccess/constants";

import storePersistent from "@Redux/Store/persistent";

let initialState = {
    accessCaptcha: 0,
    estadoAccesoWS: true
};

//Agrega al initialState lo que se seteo como permanente
initialState = storePersistent.getStorePersistent({
    reducer: 'CaptchaAccess',
    state: initialState
});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ACCESS_CAPTCHA: {
            //Persiste los datos para que no se pierdan al actualizar la página
            return storePersistent.setStorePersistent({
                reducer: 'CaptchaAccess',
                state: state,
                sectionReducer: 'accessCaptcha',
                info: action.payload
            });
        }
        case SET_STATE_ACCESS: {
            //Persiste los datos para que no se pierdan al actualizar la página
            return storePersistent.setStorePersistent({
                reducer: 'CaptchaAccess',
                state: state,
                sectionReducer: 'estadoAccesoWS',
                info: action.payload
            });
        }
        default:
            return state;
    }
};
export default reducer;

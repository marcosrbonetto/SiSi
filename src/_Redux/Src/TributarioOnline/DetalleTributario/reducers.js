import {
    SET_PAGOS_MERCADO_PAGO,
    RESET_INFO_DETALLE_TRIBUTO,
} from "@ReduxSrc/TributarioOnline/DetalleTributario/constants";

import storePersistent from "@Redux/Store/persistent";

let initialState = {
    infoPagosMercadoPago: {},
};

//Agrega al initialState lo que se seteo como permanente
initialState = storePersistent.getStorePersistent({
    reducer: 'DetalleTributario',
    state: initialState
});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PAGOS_MERCADO_PAGO: {
            //Persiste los datos para que no se pierdan al actualizar la página
            return storePersistent.setStorePersistent({
                reducer: 'DetalleTributario',
                state: state,
                sectionReducer: 'infoPagosMercadoPago',
                info: action.payload
            });
        }
        case RESET_INFO_DETALLE_TRIBUTO: {
            //Se resetean todos lo valores de la pantalla.
            let emptyState = {
                infoPagosMercadoPago: {},
            };

            //Agregamos datos persistentes
            const newState = storePersistent.getStorePersistent({
                reducer: 'DetalleTributario',
                state: emptyState
            });

            return newState;
        }
        default:
            return state;
    }
};
export default reducer;

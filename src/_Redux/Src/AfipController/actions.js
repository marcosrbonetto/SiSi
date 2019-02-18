import {
    SET_TRIBUTO_BIENES_CUIT
} from "@ReduxSrc/AfipController/constants";

export const setTributosBienesPorCUIT = datos => ({ 
    type: SET_TRIBUTO_BIENES_CUIT,
    payload: datos
});
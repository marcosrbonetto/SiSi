import {
    SET_PAGOS_MERCADO_PAGO,
    RESET_INFO_DETALLE_TRIBUTO,
} from "@ReduxSrc/TributarioOnline/DetalleTributario/constants";

export const setPagosMercadoPago = datos => ({ 
    type: SET_PAGOS_MERCADO_PAGO,
    payload: datos
});

export const resetInfoDetalleTributo = datos => ({ 
    type: RESET_INFO_DETALLE_TRIBUTO,
    payload: datos
});
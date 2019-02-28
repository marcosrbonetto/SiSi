import { 
    USUARIO_LOGIN,
    USUARIO_CERRAR_SESION,
    UPDATE_PREINSCRIPCION,
    UPDATE_ESTUDIOS,
    UPDATE_EXPERIENCIAS,
} from "@Redux/Constants/index";

export const login = usuario => ({ type: USUARIO_LOGIN, payload: usuario });
export const logout = () => ({ type: USUARIO_CERRAR_SESION });

export const actualizarPreinscipcion = data => ({ type: UPDATE_PREINSCRIPCION, payload: data });
export const actualizarEstudiosRealizados = data => ({ type: UPDATE_ESTUDIOS, payload: data });
export const actualizarExperienciasLaborales = data => ({ type: UPDATE_EXPERIENCIAS, payload: data });
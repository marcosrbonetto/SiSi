import { 
  MAIN_CONTENT_CARGANDO,
  PARA_MOBILE,
  SET_APLICACION_PANEL
} from "@Redux/Constants/index";

export const mostrarCargando = cargando => ({
  type: MAIN_CONTENT_CARGANDO,
  payload: cargando
});

export const setAplicacionPanel = datos => ({
  type: SET_APLICACION_PANEL,
  payload: datos
});

export const paraMobile = data => ({
  type: PARA_MOBILE,
  payload: data
});
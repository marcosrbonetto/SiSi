import _ from "lodash";

import {
  USUARIO_LOGIN,
  USUARIO_CERRAR_SESION,
  UPDATE_PREINSCRIPCION,
  UPDATE_ESTUDIOS,
  UPDATE_EXPERIENCIAS,
  UPDATE_DATOS_EXTRAS,
  UPDATE_PREINSCRIPCIONES_VIRTUALES
} from "@Redux/Constants/index";

const initialState = {
  loggedUser: undefined
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case USUARIO_LOGIN: {
      localStorage.setItem("token", action.payload.token);

      let loggedUser = { ...state.loggedUser };

      if (action.payload.token)
        loggedUser['token'] = action.payload.token;
      if (action.payload.datos)
        loggedUser['datos'] = action.payload.datos;
      if (action.payload.esGestor)
        loggedUser['esGestor'] = action.payload.esGestor;

      return { ...state, loggedUser: loggedUser }
    }
    case USUARIO_CERRAR_SESION: {
      localStorage.removeItem("token");
      return { ...state, loggedUser: undefined };
    }

    case UPDATE_PREINSCRIPCION: {
      let loggedUser = _.cloneDeep(state.loggedUser);
      if(!(loggedUser && loggedUser.datos)) return state;

      loggedUser.datos['preinscripcion'] = action.payload;
      
      return { ...state, loggedUser: loggedUser };
    }
    case UPDATE_ESTUDIOS: {
      let loggedUser = _.cloneDeep(state.loggedUser);
      if(!(loggedUser && loggedUser.datos)) return state;

      loggedUser.datos['estudios'] = action.payload;
      
      return { ...state, loggedUser: loggedUser };
    }
    case UPDATE_EXPERIENCIAS: {
      let loggedUser = _.cloneDeep(state.loggedUser);
      if(!(loggedUser && loggedUser.datos)) return state;

      loggedUser.datos['experienciasLaborales'] = action.payload;
      
      return { ...state, loggedUser: loggedUser };
    }
    case UPDATE_DATOS_EXTRAS: {
      let loggedUser = _.cloneDeep(state.loggedUser);
      if(!(loggedUser && loggedUser.datos)) return state;

      if(action.payload.habilidades)
        loggedUser.datos['habilidades'] = action.payload.habilidades;
      if(action.payload.idiomas)
        loggedUser.datos['idiomas'] = action.payload.idiomas;
      if(action.payload.referencias)
        loggedUser.datos['referencias'] = action.payload.referencias;
      
      return { ...state, loggedUser: loggedUser };
    }
    case UPDATE_PREINSCRIPCIONES_VIRTUALES: {
      let loggedUser = _.cloneDeep(state.loggedUser);
      if(!(loggedUser && loggedUser.datos)) return state;

      if(action.payload)
        loggedUser.datos['preinscripcionesVirtuales'] = action.payload;
      
      return { ...state, loggedUser: loggedUser };
    }
    default:
      return state;
  }
};
export default reducer;

import { USUARIO_LOGIN, USUARIO_CERRAR_SESION } from "@Redux/Constants/index";

const initialState = {
  loggedUser: undefined
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case USUARIO_LOGIN: {
      localStorage.setItem("token", action.payload.token);
      
      let loggedUser = {...state.loggedUser};

      if(action.payload.token)
        loggedUser['token'] = action.payload.token;
      if(action.payload.datos)
        loggedUser['datos'] = action.payload.datos;

      return {...state, loggedUser: loggedUser}
    }
    case USUARIO_CERRAR_SESION: {
      localStorage.removeItem("token");
      return { ...state, loggedUser: undefined };
    }
    default:
      return state;
  }
};
export default reducer;

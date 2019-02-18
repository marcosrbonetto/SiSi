import {
  MAIN_CONTENT_CARGANDO,
  PARA_MOBILE,
  SET_APLICACION_PANEL
} from "@Redux/Constants/index";
import _ from "lodash";

const initialState = {
  cargando: false,
  loggedUser: {},
  cantProcesosCargando: 0,
  paraMobile: false,
  aplicacionesPanel: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case MAIN_CONTENT_CARGANDO: {
      let newState = { ...state };

      const cargar = action.payload;
      if(cargar == 'reset') {
        newState.cantProcesosCargando = 0;
      } else if (cargar) {
        newState.cargando = cargar;
        newState.cantProcesosCargando += 1;
      } else {
        //Corroboramos que no exista procesos cargando
        if (newState.cantProcesosCargando > 0)
          newState.cantProcesosCargando -= 1;

        if (newState.cantProcesosCargando == 0)
          newState.cargando = cargar;
      }

      return newState;
    }
    case PARA_MOBILE: {
      return { ...state, paraMobile: action.payload };
    }
    case SET_APLICACION_PANEL: {
      return { ...state, aplicacionesPanel: action.payload };
    }
    default:
      return state;
  }
};
export default reducer;

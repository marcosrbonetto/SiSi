import Usuario from "./usuario";
import Alerta from "./alerta";
import MainContent from "./mainContent";

import { combineReducers } from "redux";

const rootReducer = combineReducers({
  Usuario,
  Alerta,
  MainContent
});

export default rootReducer;

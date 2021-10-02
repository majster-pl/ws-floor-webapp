import { combineReducers } from "redux";
import loggedReducer from "./isLogged";
import modalReducer from "./modal";

const rootReducers = combineReducers({
  isLogged: loggedReducer,
  modal: modalReducer,
});

export default rootReducers;

import { combineReducers } from "redux";
import depotReducer from "./depot";
import loggedReducer from "./isLogged";
import modalReducer from "./modal";
import depotsListReducer from "./depotsList";
import userReducer from "./user";
import workshopReducer from "./workshop";
import bookingCountReducer from "./bookingsCount";

const rootReducers = combineReducers({
  isLogged: loggedReducer,
  user: userReducer,
  modal: modalReducer,
  depot: depotReducer,
  depots: depotsListReducer,
  workshop: workshopReducer,
  bookings_count: bookingCountReducer
});

export default rootReducers;

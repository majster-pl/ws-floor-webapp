import { combineReducers } from "redux";
import depotReducer from "./depot";
import loggedReducer from "./isLogged";
import modalReducer from "./modal";
import depotsListReducer from "./depotsList";
import userReducer from "./user";
import workshopReducer from "./workshop";
import bookingCountReducer from "./bookingsCount";
import eventHistoryCount from "./eventHistoryCount";
import eventActiveCount from "./eventActiveCount";

const rootReducers = combineReducers({
  isLogged: loggedReducer,
  user: userReducer,
  modal: modalReducer,
  depot: depotReducer,
  depots: depotsListReducer,
  workshop: workshopReducer,
  bookings_count: bookingCountReducer,
  events_history_count: eventHistoryCount,
  events_active_count: eventActiveCount,
});

export default rootReducers;

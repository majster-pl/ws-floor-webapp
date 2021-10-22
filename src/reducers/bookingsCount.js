import * as actions from "../actionTypes";

const bookingCountReducer = (state = 0, action) => {
  switch (action.type) {
    case actions.BOOKINGS_COUNT_SET:
      return action.payload;

    default:
      return state;
  }
};

export default bookingCountReducer;

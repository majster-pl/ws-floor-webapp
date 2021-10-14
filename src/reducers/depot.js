import * as actions from "../actionTypes";

const depotReducer = (state = 0, action) => {
  switch (action.type) {
    case actions.DEPOT_SET:
      return action.payload;

    default:
      return state;
  }
};

export default depotReducer;

import * as actions from "../actionTypes";

const workshopReducer = (state = 0, action) => {
  switch (action.type) {
    case actions.WORKSHOP_RELOAD:
      return action.payload;

    default:
      return state;
  }
};

export default workshopReducer;

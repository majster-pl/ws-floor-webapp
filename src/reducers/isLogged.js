import * as actions from "../actionTypes";

const loggedReducer = (state = false, action) => {
  switch (action.type) {
    case actions.AUTHENTICATED:
      return !state;

    default:
      return state;
  }
};

export default loggedReducer;

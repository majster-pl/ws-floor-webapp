import * as actions from "../actionTypes";

const modalReducer = (state = 0, action) => {
  switch (action.type) {
    case actions.EVENT_EDIT:
      return state + 1;

    default:
      return state;
  }
};

export default modalReducer;

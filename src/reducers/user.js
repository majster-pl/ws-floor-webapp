import * as actions from "../actionTypes";

const userReducer = (state = 0, action) => {
  switch (action.type) {
    case actions.USER_SET:
      return action.payload;

    default:
      return state;
  }
};

export default userReducer;

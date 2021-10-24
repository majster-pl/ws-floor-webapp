import * as actions from "../actionTypes";

const eventActiveCount = (state = 0, action) => {
  switch (action.type) {
    case actions.EVENTS_ACTIVE_COUNT_SET:
      return action.payload;

    default:
      return state;
  }
};

export default eventActiveCount;

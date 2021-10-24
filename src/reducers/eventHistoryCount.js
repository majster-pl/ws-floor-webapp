import * as actions from "../actionTypes";

const eventHistoryCount = (state = 0, action) => {
  switch (action.type) {
    case actions.EVENTS_HISTORY_COUNT_SET:
      return action.payload;

    default:
      return state;
  }
};

export default eventHistoryCount;

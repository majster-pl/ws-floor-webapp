import * as actions from "../actionTypes";

const depotsListReducer = (state = [], action) => {
  switch (action.type) {
    case actions.DEPOT_LIST_SET:
      return action.payload;

    default:
      return state;
  }
};

export default depotsListReducer;

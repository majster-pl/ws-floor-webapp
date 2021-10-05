import * as actions from "../actionTypes";

export const setModal = (modal) => {
  return {
    type: actions.EVENT_EDIT,
    payload: modal,
  };
};

export const authenticated = (auth) => {
  return {
    type: actions.AUTHENTICATED,
    payload: auth,
  };
};
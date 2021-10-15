import * as actions from "../actionTypes";

export const setUser = (id) => {
  return {
    type: actions.USER_SET,
    payload: id,
  };
};

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

export const setDepot = (depot) => {
  return {
    type: actions.DEPOT_SET,
    payload: depot,
  };
};

export const setDepotsList = (depots) => {
  return {
    type: actions.DEPOT_LIST_SET,
    payload: depots,
  };
};


export const reloadWorkshop = (id) => {
  return {
    type: actions.WORKSHOP_RELOAD,
    payload: id,
  };
};

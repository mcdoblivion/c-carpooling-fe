import { AUTHORIZED, AuthorizedModel } from "./types";

const INIT_STATE: AuthorizedModel = {
  authorizedMenu: [],
  authorizedAction: [],
  authorizedMenuMapper: {},
};

const Authorized = (state = INIT_STATE, action: any) => {
  switch (action.type) {
    case AUTHORIZED.UPDATE_AUTHORIZED_ALL:
      return {
        ...state,
        ...action.payload,
      };
    case AUTHORIZED.UPDATE_AUTHORIZED_MENU:
      return {
        ...state,
        authorizedMenu: action.payload,
      };
    case AUTHORIZED.UPDATE_AUTHORIZED_ACTION:
      return {
        ...state,
        authorizedAction: action.payload,
      };
    case AUTHORIZED.UPDATE_AUTHORIZED_MENU_MAPPER:
      return {
        ...state,
        authorizedMenuMapper: action.payload,
      };
    default:
      return state;
  }
};

export default Authorized;

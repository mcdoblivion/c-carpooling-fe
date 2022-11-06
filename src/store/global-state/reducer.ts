import { AppUser } from "models/AppUser";
import { GLOBAL_STATE_ACTION, GlobalStateModel } from "./types";

const INIT_STATE: GlobalStateModel = {
  user: new AppUser(),
};

const GlobalState = (state = INIT_STATE, action: any) => {
  switch (action.type) {
    case GLOBAL_STATE_ACTION.UPDATE_USER:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

export default GlobalState;

import { AppUser } from "./../../models/AppUser/AppUser";
import { GLOBAL_STATE_ACTION } from "./types";

export const updateUser = (user: AppUser) => {
  return {
    type: GLOBAL_STATE_ACTION.UPDATE_USER,
    payload: user,
  };
};

import { AppUser } from "models/AppUser";

export enum GLOBAL_STATE_ACTION {
  UPDATE_USER,
}

export interface GlobalStateModel {
  user: AppUser;
}

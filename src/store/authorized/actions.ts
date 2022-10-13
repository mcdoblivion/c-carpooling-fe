import { Menu } from "config/menu";
import { AUTHORIZED, AuthorizedModel } from "./types";

export const updateAuthorizedAll = (value: Partial<AuthorizedModel>) => {
  return {
    type: AUTHORIZED.UPDATE_AUTHORIZED_ALL,
    payload: { ...value },
  };
};

export const updateAuthorizedMenu = (menu: Menu[]) => {
  return {
    type: AUTHORIZED.UPDATE_AUTHORIZED_MENU,
    payload: [...menu],
  };
};

export const updateAuthorizedAction = (action: string[]) => {
  return {
    type: AUTHORIZED.UPDATE_AUTHORIZED_ACTION,
    payload: [...action],
  };
};

export const updateAuthorizedMenuMapper = (
  menuMapper: Record<string, number>
) => {
  return {
    type: AUTHORIZED.UPDATE_AUTHORIZED_MENU_MAPPER,
    payload: { ...menuMapper },
  };
};

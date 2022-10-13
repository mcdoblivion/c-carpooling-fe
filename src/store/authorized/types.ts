import { Menu } from "config/menu";

export enum AUTHORIZED {
  UPDATE_AUTHORIZED_ALL,
  UPDATE_AUTHORIZED_MENU,
  UPDATE_AUTHORIZED_ACTION,
  UPDATE_AUTHORIZED_MENU_MAPPER,
}

export interface AuthorizedModel {
  authorizedMenu: Menu[];
  authorizedAction: string[];
  authorizedMenuMapper: Record<string, number>;
}

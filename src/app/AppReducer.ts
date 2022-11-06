import { Menu } from "config/menu";

/**
 *
 * Contain AppState and reducer
 *
 * */
export interface AppState {
  permissionPaths?: string[];
  authorizedMenus?: Menu[];
  authorizedAction?: string[];
  authorizedMenuMapper?: Record<string, any>;
}

export interface AppAction {
  type: AppActionEnum;
  permissionPaths?: string[];
  authorizedMenus?: Menu[];
  authorizedAction?: string[];
  authorizedMenuMapper?: Record<string, any>;
}

export enum AppActionEnum {
  SET_PERMISSION,
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case AppActionEnum.SET_PERMISSION: {
      return {
        ...state,
        permissionPaths: action.permissionPaths,
        authorizedMenus: action.authorizedMenus,
        authorizedAction: action.authorizedAction,
        authorizedMenuMapper: action.authorizedMenuMapper,
      };
    }
  }
}

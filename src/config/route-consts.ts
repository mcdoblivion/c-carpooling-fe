import { join } from "path";

export const ROOT_ROUTE: string = process.env.PUBLIC_URL;
export const LOGIN_ROUTE: string = ROOT_ROUTE
  ? ROOT_ROUTE + "/login"
  : "/login";
export const LOGOUT_ROUTE: string = ROOT_ROUTE
  ? ROOT_ROUTE + "/logout"
  : "/logout";
export const FORBIDENT_ROUTE: string = "/403";
export const NOT_FOUND_ROUTE: string = "/404";

export const TYPOGRAPHY_PAGE_ROUTE: string = ROOT_ROUTE
  ? join(ROOT_ROUTE + "/typography")
  : "/typography";
export const COLOR_PAGE_ROUTE: string = ROOT_ROUTE
  ? join(ROOT_ROUTE + "/color")
  : "/color";
export const SIDE_BAR_PAGE_ROUTE: string = ROOT_ROUTE
  ? join(ROOT_ROUTE + "/side-bar")
  : "/side-bar";

export const USER_ROUTE: string = ROOT_ROUTE
  ? join(ROOT_ROUTE + "/users")
  : "/users";
export const USER_PREVIEW_ROUTE: string = ROOT_ROUTE
  ? join(ROOT_ROUTE + "/users-preview")
  : "/users-preview";

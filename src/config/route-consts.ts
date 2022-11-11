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
export const LEAVE_GROUP_REQUEST_ROUTE: string = ROOT_ROUTE
  ? join(ROOT_ROUTE + "/leave-group-requests")
  : "/leave-group-requests";
export const USER_PREVIEW_ROUTE: string = ROOT_ROUTE
  ? join(ROOT_ROUTE + "/users-preview")
  : "/users-preview";
export const PAYMENT_ROUTE: string = ROOT_ROUTE
  ? join(ROOT_ROUTE + "/payment")
  : "/payment";
export const VEHICLES_ROUTE: string = ROOT_ROUTE
  ? join(ROOT_ROUTE + "/vehicles")
  : "/vehicles";
export const DRIVERS_ROUTE: string = ROOT_ROUTE
  ? join(ROOT_ROUTE + "/drivers")
  : "/drivers";
export const LEAVE_REQUEST_ROUTE: string = ROOT_ROUTE
  ? join(ROOT_ROUTE + "/leave-requets")
  : "/leave-requets";
export const DAY_OFF_REQUEST_ROUTE: string = ROOT_ROUTE
  ? join(ROOT_ROUTE + "/day-off-requests")
  : "/day-off-requests";
export const CARPOOLING_LOG_ROUTE: string = ROOT_ROUTE
  ? join(ROOT_ROUTE + "/carpooling-logs")
  : "/carpooling-logs";

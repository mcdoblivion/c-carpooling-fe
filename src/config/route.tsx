import Login from "pages/Authentication/Login/Login";
import Logout from "pages/Authentication/Logout";
import { Redirect } from "react-router";
import LeaveGroupRequestMaster from "views/LeaveGroupRequestView/LeaveGroupRequestMaster";
import UserView from "views/UserView/UserView";
import {
  LEAVE_GROUP_REQUEST_ROUTE,
  LOGIN_ROUTE,
  LOGOUT_ROUTE,
  USER_ROUTE,
} from "./route-consts";

export interface Route {
  path: string;
  component: (() => JSX.Element) | React.LazyExoticComponent<() => JSX.Element>;
  exact?: boolean;
}

const userRoutes: Route[] = [
  {
    path: USER_ROUTE,
    component: UserView,
  },
  {
    path: LEAVE_GROUP_REQUEST_ROUTE,
    component: LeaveGroupRequestMaster,
  },

  // Created route for project:

  // this base route should be at the end of all other routes
  {
    path: `${process.env.PUBLIC_URL}/`,
    exact: true,
    component: () => <Redirect to={USER_ROUTE} />,
  },
];

const authRoutes = [
  { path: LOGOUT_ROUTE, component: Logout },
  { path: LOGIN_ROUTE, component: Login },
];

export { userRoutes, authRoutes };

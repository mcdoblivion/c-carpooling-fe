import Login from "pages/Authentication/Login/Login";
import Logout from "pages/Authentication/Logout";
import { Redirect } from "react-router";
import UserPreview from "views/UserView/UserPreview/UserPreview";
import UserView from "views/UserView/UserView";
import {
  LOGIN_ROUTE,
  LOGOUT_ROUTE,
  USER_PREVIEW_ROUTE,
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
    path: USER_PREVIEW_ROUTE,
    component: UserPreview,
  },
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

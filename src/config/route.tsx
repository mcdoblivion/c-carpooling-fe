import Login from "pages/Authentication/Login";
import Logout from "pages/Authentication/Logout";
import Color from "pages/Color";
import Typography from "pages/Typography";
import { Redirect } from "react-router";
import {
  COLOR_PAGE_ROUTE,
  LOGIN_ROUTE,
  LOGOUT_ROUTE,
  TYPOGRAPHY_PAGE_ROUTE,
} from "./route-consts";

export interface Route {
  path: string;
  component: (() => JSX.Element) | React.LazyExoticComponent<() => JSX.Element>;
  exact?: boolean;
}

const userRoutes: Route[] = [
  // Default init route for template:

  {
    path: TYPOGRAPHY_PAGE_ROUTE,
    component: Typography,
  },
  {
    path: COLOR_PAGE_ROUTE,
    component: Color,
  },

  // Created route for project:

  // this base route should be at the end of all other routes
  {
    path: `${process.env.PUBLIC_URL}/`,
    exact: true,
    component: () => <Redirect to={TYPOGRAPHY_PAGE_ROUTE} />,
  },
];

const authRoutes = [
  { path: LOGOUT_ROUTE, component: Logout },
  { path: LOGIN_ROUTE, component: Login },
];

export { userRoutes, authRoutes };

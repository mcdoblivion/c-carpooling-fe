import Login from "pages/Authentication/Login/Login";
import Logout from "pages/Authentication/Logout";
import { Redirect } from "react-router";
import LeaveGroupRequestMaster from "views/LeaveGroupRequestView/LeaveGroupRequestMaster";
import UserView from "views/UserView/UserView";
import Payment from "views/Payment/Payment";
import UserPreview from "views/UserView/UserPreview/UserPreview";
import {
  DAY_OFF_REQUEST_ROUTE,
  LEAVE_GROUP_REQUEST_ROUTE,
  LOGIN_ROUTE,
  LOGOUT_ROUTE,
  PAYMENT_ROUTE,
  USER_PREVIEW_ROUTE,
  USER_ROUTE,
} from "./route-consts";
import DayOffRequestMaster from "views/DayOffRequestView/DayOffRequestMaster";

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
  {
    path: DAY_OFF_REQUEST_ROUTE,
    component: DayOffRequestMaster,
  },
  {
    path: USER_PREVIEW_ROUTE,
    component: UserPreview,
  },
  {
    path: PAYMENT_ROUTE,
    component: Payment,
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

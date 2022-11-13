import Login from "pages/Authentication/Login/Login";
import Logout from "pages/Authentication/Logout";
import { Redirect } from "react-router";
import LeaveGroupRequestMaster from "views/LeaveGroupRequestView/LeaveGroupRequestMaster";
import UserView from "views/UserView/UserView";
import Payment from "views/Payment/Payment";
import UserPreview from "views/UserView/UserPreview/UserPreview";
import {
  CARPOOLING_LOG_ROUTE,
  DAY_OFF_REQUEST_ROUTE,
  DRIVERS_ROUTE,
  LEAVE_GROUP_REQUEST_ROUTE,
  LOGIN_ROUTE,
  LOGOUT_ROUTE,
  PAYMENT_ROUTE,
  USER_PREVIEW_ROUTE,
  USER_ROUTE,
  VEHICLES_ROUTE,
} from "./route-consts";
import DayOffRequestMaster from "views/DayOffRequestView/DayOffRequestMaster";
import CarpoolingLogMaster from "views/CarpoolingLogView/CarpoolingLogMaster";
import VehicleMaster from "views/VehicleView/VehicleMaster";
import DriverMaster from "views/DriverView/DriverMaster";

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
    path: CARPOOLING_LOG_ROUTE,
    component: CarpoolingLogMaster,
  },
  {
    path: VEHICLES_ROUTE,
    component: VehicleMaster,
  },
  {
    path: DRIVERS_ROUTE,
    component: DriverMaster,
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

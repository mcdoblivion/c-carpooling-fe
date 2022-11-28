import Login from "pages/Authentication/Login/Login";
import Logout from "pages/Authentication/Logout";
import LeaveGroupRequestMaster from "views/LeaveGroupRequestView/LeaveGroupRequestMaster";
import UserView from "views/UserView/UserView";
import Payment from "views/Payment/Payment";
import UserPreview from "views/UserView/UserPreview/UserPreview";
import {
  ADDRESS_ROUTE,
  CARPOOLING_GROUP_NORMAL_ROUTE,
  CARPOOLING_GROUP_ROUTE,
  CARPOOLING_LOG_ROUTE,
  CRON_JOB_ROUTE,
  DAY_OFF_REQUEST_NORMAL_ROUTE,
  DAY_OFF_REQUEST_ROUTE,
  DRIVERS_ROUTE,
  LEAVE_GROUP_REQUEST_ROUTE,
  LOGIN_ROUTE,
  LOGOUT_ROUTE,
  PAYMENT_ROUTE,
  REGISTER_DRIVER_ROUTE,
  USER_PREVIEW_ROUTE,
  USER_ROUTE,
  VEHICLES_NORMAL_DETAIL_ROUTE,
  VEHICLES_NORMAL_ROUTE,
  VEHICLES_ROUTE,
  WALLET_ROUTE,
} from "./route-consts";
import DayOffRequestMaster from "views/DayOffRequestView/DayOffRequestMaster";
import CarpoolingLogMaster from "views/CarpoolingLogView/CarpoolingLogMaster";
import VehicleMaster from "views/VehicleView/VehicleMaster";
import DriverMaster from "views/DriverView/DriverMaster";
import CarpoolingGroupMaster from "views/CarpoolingGroupView/CarpoolingGroupMaster";
import RegisterDriver from "views/RegisterDriverView/RegisterDriver";
import Address from "views/AddressView/Address";
import CarpoolingGroupNormal from "views/CarpoolingGroupNormalView/CarpoolingGroupNormal";
import DayOffRequestNormal from "views/DayOffRequestNormalView/DayOffRequestNormal";
import Home from "pages/HomePage/HomePage";
import VehicleNormalMaster from "views/VehicleNormalView/VehicleNormalMaster";
import VehicleNormalDetail from "views/VehicleNormalView/VehicleNormalDetail";
import WalletMaster from "views/WalletView/WalletMaster";
import CronJob from "views/CronJobView/CronJob";

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
    path: DAY_OFF_REQUEST_NORMAL_ROUTE,
    component: DayOffRequestNormal,
  },

  {
    path: CARPOOLING_LOG_ROUTE,
    component: CarpoolingLogMaster,
  },
  {
    path: CARPOOLING_GROUP_ROUTE,
    component: CarpoolingGroupMaster,
  },
  {
    path: CARPOOLING_GROUP_NORMAL_ROUTE,
    component: CarpoolingGroupNormal,
  },
  {
    path: VEHICLES_ROUTE,
    component: VehicleMaster,
  },
  {
    path: VEHICLES_NORMAL_ROUTE,
    component: VehicleNormalMaster,
  },
  {
    path: VEHICLES_NORMAL_DETAIL_ROUTE,
    component: VehicleNormalDetail,
  },
  {
    path: DRIVERS_ROUTE,
    component: DriverMaster,
  },
  {
    path: REGISTER_DRIVER_ROUTE,
    component: RegisterDriver,
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
    path: WALLET_ROUTE,
    component: WalletMaster,
  },
  {
    path: ADDRESS_ROUTE,
    component: Address,
  },
  {
    path: CRON_JOB_ROUTE,
    component: CronJob,
  },
  {
    path: `${process.env.PUBLIC_URL}/`,
    exact: true,
    component: Home,
  },
];

const authRoutes = [
  { path: LOGOUT_ROUTE, component: Logout },
  { path: LOGIN_ROUTE, component: Login },
];

export { userRoutes, authRoutes };

import { TFunction } from "i18next";
import { ReactNode } from "react";
import { ADMIN, NORMAL_USER } from "./consts";
import {
  ADDRESS_ROUTE,
  CARPOOLING_GROUP_NORMAL_ROUTE,
  CARPOOLING_GROUP_ROUTE,
  CARPOOLING_LOG_ROUTE,
  DAY_OFF_REQUEST_NORMAL_ROUTE,
  DAY_OFF_REQUEST_ROUTE,
  DRIVERS_ROUTE,
  LEAVE_GROUP_REQUEST_ROUTE,
  USER_ROUTE,
  VEHICLES_ROUTE,
} from "./route-consts";

export interface Menu {
  name?: string | TFunction;
  icon?: string | ReactNode;
  link: string;
  children?: Menu[];
  active?: boolean;
  show?: boolean;
}
const user = JSON.parse(localStorage.getItem("currentUserInfo"));
export const menu: Menu[] = [
  // {
  //   name: "Đăng ký trở thành tài xế",
  //   icon: "bx-home",
  //   link: REGISTER_DRIVER_ROUTE,
  //   show:
  //     (!user?.driver ||
  //       user?.driver?.status === "Pending" ||
  //       user?.driver?.status === "Rejected") &&
  //     user?.role === NORMAL_USER
  //       ? true
  //       : false,
  //   active: false,
  // },
  {
    name: "Địa chỉ",
    icon: "bx-home",
    link: ADDRESS_ROUTE,
    show: user?.role === NORMAL_USER ? true : false,
    active: false,
  },
  {
    name: "Nhóm đi chung",
    icon: "bx-home",
    link: CARPOOLING_GROUP_NORMAL_ROUTE,
    show: user?.role === NORMAL_USER ? true : false,
    active: false,
  },
  {
    name: "Yêu cầu nghỉ phép",
    icon: "bx-home",
    link: DAY_OFF_REQUEST_NORMAL_ROUTE,
    show: user?.role === NORMAL_USER && user?.carpoolingGroupId ? true : false,
    active: false,
  },

  {
    name: "Người dùng",
    icon: "bx-home",
    link: USER_ROUTE,
    show: user?.role === ADMIN ? true : false,
    active: false,
  },
  {
    name: "Tài xế",
    icon: "bx-home",
    link: DRIVERS_ROUTE,
    show: user?.role === ADMIN ? true : false,
    active: false,
  },
  {
    name: "Phương tiện",
    icon: "bx-home",
    link: VEHICLES_ROUTE,
    show: user?.role === ADMIN ? true : false,
    active: false,
  },
  {
    name: "Yêu cầu nghỉ phép",
    icon: "bx-home",
    link: DAY_OFF_REQUEST_ROUTE,
    show: user?.role === ADMIN ? true : false,
    active: false,
  },
  {
    name: "Lịch sử đi chung",
    icon: "bx-home",
    link: CARPOOLING_LOG_ROUTE,
    show: user?.role === ADMIN ? true : false,
    active: false,
  },
  {
    name: "Yêu cầu rời nhóm",
    icon: "bx-home",
    link: LEAVE_GROUP_REQUEST_ROUTE,
    show: user?.role === ADMIN ? true : false,
    active: false,
  },
  {
    name: "Nhóm đi chung",
    icon: "bx-home",
    link: CARPOOLING_GROUP_ROUTE,
    show: user?.role === ADMIN ? true : false,
    active: false,
  },
];

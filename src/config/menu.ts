import { TFunction } from "i18next";
import { ReactNode } from "react";
import { ADMIN, NORMAL_USER, RequestStatus } from "./consts";
import {
  ADDRESS_ROUTE,
  CARPOOLING_GROUP_NORMAL_ROUTE,
  CARPOOLING_GROUP_ROUTE,
  CARPOOLING_LOG_ROUTE,
  CRON_JOB_ROUTE,
  DAY_OFF_REQUEST_NORMAL_ROUTE,
  DAY_OFF_REQUEST_ROUTE,
  DRIVERS_ROUTE,
  LEAVE_GROUP_REQUEST_NORMAL_ROUTE,
  LEAVE_GROUP_REQUEST_ROUTE,
  REGISTER_DRIVER_ROUTE,
  USER_ROUTE,
  VEHICLES_NORMAL_ROUTE,
  VEHICLES_ROUTE,
  WALLET_ROUTE,
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
  {
    name: "Đăng ký trở thành tài xế",
    icon: "bx-home",
    link: REGISTER_DRIVER_ROUTE,
    show:
      user?.role === NORMAL_USER &&
      user?.driver?.status !== RequestStatus.ACCEPTED,

    active: false,
  },
  {
    name: "Địa chỉ",
    icon: "bx-location-plus",
    link: ADDRESS_ROUTE,
    show: user?.role === NORMAL_USER ? true : false,
    active: false,
  },
  {
    name: "Người dùng",
    icon: "bx-user",
    link: USER_ROUTE,
    show: user?.role === ADMIN ? true : false,
    active: false,
  },
  {
    name: "Tài xế",
    icon: "bx-user-pin",
    link: DRIVERS_ROUTE,
    show: user?.role === ADMIN ? true : false,
    active: false,
  },
  {
    name: "Phương tiện",
    icon: "bx-car",
    link: user?.role === ADMIN ? VEHICLES_ROUTE : VEHICLES_NORMAL_ROUTE,
    show: user?.role === ADMIN || !!user?.driver,
    active: false,
  },
  {
    name: "Nhóm đi chung",
    icon: "bx-group",
    link:
      user?.role === ADMIN
        ? CARPOOLING_GROUP_ROUTE
        : CARPOOLING_GROUP_NORMAL_ROUTE,
    show: true,
    active: false,
  },
  {
    name: "Yêu cầu nghỉ phép",
    icon: "bx-question-mark",
    link:
      user?.role === NORMAL_USER && user?.carpoolingGroupId
        ? DAY_OFF_REQUEST_NORMAL_ROUTE
        : DAY_OFF_REQUEST_ROUTE,
    show: true,
    active: false,
  },
  {
    name: "Yêu cầu rời nhóm",
    icon: "bx-log-out-circle",
    link:
      user?.role === ADMIN
        ? LEAVE_GROUP_REQUEST_ROUTE
        : LEAVE_GROUP_REQUEST_NORMAL_ROUTE,
    show: true,
    active: false,
  },
  {
    name: "Lịch sử đi chung",
    icon: "bx-home",
    link: CARPOOLING_LOG_ROUTE,
    show: true,
    active: false,
  },
  {
    name: "Quản lý tác vụ",
    icon: "bx-task",
    link: CRON_JOB_ROUTE,
    show: user?.role === ADMIN ? true : false,
    active: false,
  },
  {
    name: "Ví C-Carpooling",
    icon: "bx-wallet",
    link: WALLET_ROUTE,
    show: user?.role === NORMAL_USER,
    active: false,
  },
];

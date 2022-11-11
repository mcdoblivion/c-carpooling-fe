import { ReactNode } from "react";
import { TFunction } from "i18next";
import { LEAVE_GROUP_REQUEST_ROUTE, USER_ROUTE } from "./route-consts";

export interface Menu {
  name?: string | TFunction;
  icon?: string | ReactNode;
  link: string;
  children?: Menu[];
  active?: boolean;
  show?: boolean;
}

export const menu: Menu[] = [
  {
    name: "Quản lý người dùng",
    icon: "bx-home",
    link: USER_ROUTE,
    show: true,
    active: false,
  },
  {
    name: "Yêu cầu rời nhóm",
    icon: "bx-home",
    link: LEAVE_GROUP_REQUEST_ROUTE,
    show: true,
    active: false,
  },
];

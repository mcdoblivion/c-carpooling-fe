import { ReactNode } from "react";
import { TFunction } from "i18next";
import { USER_ROUTE } from "./route-consts";

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
    name: "Quản lý người dùng",
    icon: "bx-home",
    link: USER_ROUTE,
    show: user.role === "ADMIN" ? true : false,
    active: false,
  },
];

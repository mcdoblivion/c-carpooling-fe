import { ReactNode } from "react";
import { translate } from "i18n/i18n";
import { TFunction } from "i18next";
import {
  COLOR_PAGE_ROUTE,
  SIDE_BAR_PAGE_ROUTE,
  TYPOGRAPHY_PAGE_ROUTE,
} from "./route-consts";

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
    name: translate("menu.title.dashboard"),
    icon: "bx-home",
    link: "/dashboard",
    show: true,
    active: false,
    children: [
      {
        name: translate("menu.title.typography"),
        icon: "bx-pen",
        link: TYPOGRAPHY_PAGE_ROUTE,
        active: false,
        show: true,
      },
      {
        name: translate("menu.title.color"),
        icon: "bx-paint",
        link: COLOR_PAGE_ROUTE,
        active: false,
        show: true,
      },
      {
        name: "Nested Menu",
        icon: "bx-paint",
        link: "/buttton",
        active: false,
        show: true,
        children: [
          {
            name: translate("menu.title.sidebar"),
            icon: "bx-paint",
            link: SIDE_BAR_PAGE_ROUTE,
            active: false,
            show: true,
          },
        ],
      },
    ],
  },
];

import React from "react";
import { Menu as AntdMenu, Avatar } from "antd";
import { ChevronDown16 } from "@carbon/icons-react";
import { NavLink, useHistory } from "react-router-dom";
import { Menu, menu } from "config/menu";
import "./Sidebar.scss";
const { SubMenu } = AntdMenu;

interface SidebarProps {
  menus?: Menu[];
}

function Sidebar(props: SidebarProps) {
  const { menus } = props;
  const [listActiveMenu, setListActiveMenu] = React.useState<string[]>([]);
  const [listOpen, setListOpen] = React.useState<string[]>([]);
  const history = useHistory();

  const findOpenKey = React.useCallback(
    (path: string, menus: Menu[], openKeys: string[]) => {
      if (menus && menus.length > 0) {
        var nodefound: boolean = false;
        menus.forEach((currentMenu: Menu) => {
          const { link, children } = currentMenu;
          if (children && children.length > 0) {
            var isFound = findOpenKey(path, children, openKeys);
            if (isFound) {
              openKeys.push(link);
            }
          } else {
            if (path === link) {
              nodefound = true;
            }
          }
        });
        return nodefound;
      }
    },
    []
  );

  // handle active menu
  const handleActiveMenu = React.useCallback(
    (path: string) => {
      var openKeys: string[] = [];
      findOpenKey(path, menus, openKeys);
      setListOpen(openKeys);
      setListActiveMenu([path]);
    },
    [findOpenKey, menus]
  );

  // using when navigate
  React.useEffect(() => {
    return history.listen((location) => {
      handleActiveMenu(location.pathname);
    });
  }, [handleActiveMenu, history]);

  // using when f5
  React.useEffect(() => {
    handleActiveMenu(window.location.pathname);
  }, [handleActiveMenu]);

  const renderMenu = React.useCallback((listMenu: Menu[]) => {
    return listMenu.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <SubMenu key={item.link} title={item.name}>
            {renderMenu(item.children)}
          </SubMenu>
        );
      }
      return (
        <AntdMenu.Item key={item.link}>
          <NavLink to={item.link}>{item.name}</NavLink>
        </AntdMenu.Item>
      );
    });
  }, []);
  return (
    <div className="sidebar__wrapper">
      <div className="sidebar__title">
        <Avatar
          shape="square"
          size={32}
          style={{ backgroundColor: "#A7F0BA", color: "#161616" }}
        >
          M
        </Avatar>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div
            style={{ fontSize: "14px", fontWeight: "bold", color: "#161616" }}
          >
            Side Menu Level 1
          </div>
          <div style={{ fontSize: "10px", color: "#6F6F6F" }}>
            Side Menu Level 1
          </div>
        </div>
      </div>
      <AntdMenu
        style={{ width: 200 }}
        defaultOpenKeys={listOpen}
        mode="inline"
        expandIcon={<ChevronDown16 />}
        selectedKeys={listActiveMenu}
      >
        {renderMenu(menus && menus.length > 0 ? menus : menu)}
      </AntdMenu>
    </div>
  );
}

export default Sidebar;

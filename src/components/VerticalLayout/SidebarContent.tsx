/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from "react";
import SimpleBar from "simplebar-react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { Menu, menu } from "config/menu";
import { Collapse } from "react-collapse";

const SidebarContent = () => {
  const [menuState, setMenuState] = useState(menu);
  const ref: any = useRef();

  const dispatch = useDispatch();
  const layout = useSelector((state: any) => state.Layout);

  // Check if a menu/submenu contain an active path
  const findActivePath: any = React.useCallback(
    (menu: Menu[], path: string) => {
      return menu.find((_item: Menu) => {
        if (_item.link === path) {
          return true;
        }
        if (!_item.children) return false;
        return findActivePath(_item.children, path);
      });
    },
    []
  );

  // recursively activate from child to parent
  const recursiveActivate = React.useCallback(
    (menu: Menu[], path: string) => {
      // eslint-disable-next-line array-callback-return
      menu.map((i) => {
        if (i.link === path) {
          i.active = true;
        } else {
          i.active = false;
        }
        if (!i.children) return false;
        if (findActivePath(i.children, path)) {
          i.active = true;
        }
        recursiveActivate(i.children, path);
        return i;
      });
    },
    [findActivePath]
  );

  const recursiveActivateMenu = React.useCallback((menu: Menu[], item) => {
    menu.forEach((i) => {
      if (menu.includes(item)) {
        if (i.link !== item.link) {
          i.active = false;
        }
      }
      if (i.children) recursiveActivateMenu(i.children, item);
    });
  }, []);

  const onMenuClick = (item: Menu) => {
    const tmpMenu = [...menu];
    if (!item.active) {
      item.active = true;
      if (tmpMenu && tmpMenu.length > 0) {
        tmpMenu.map((i: Menu) => {
          if (i.children) {
            recursiveActivateMenu(i.children, item);
          }
          return i;
        });
      }
    } else {
      if (item.children) {
        item.active = false;
      }
    }

    setMenuState(tmpMenu);
  };

  const onLinkClick = (item: Menu) => {
    if (!layout.leftMenu)
      dispatch({ type: "TOGGLE_LEFTMENU", payload: !layout.leftMenu });
    const tmpMenu = [...menu];
    recursiveActivate(tmpMenu, item.link);
    setMenuState(tmpMenu);
  };

  useEffect(() => {
    const currentUrl = window.location.pathname;
    const urlSplits = currentUrl.split("/");
    const currentPath = "/" + urlSplits[1];
    const initMenuState = menu ? [...menu] : [];

    if (findActivePath(initMenuState, currentPath))
      recursiveActivate(initMenuState, currentPath);

    setMenuState(initMenuState);

    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    ref.current.recalculate();
  });

  const renderMenu = (menus: Menu[], active?: boolean) => {
    return (
      <ul>
        <Collapse isOpened={active}>
          {menus.map((item: Menu, index: number) => (
            <li key={index}>
              {item.children ? (
                <>
                  <a
                    onClick={() => onMenuClick(item)}
                    className={classNames({
                      "has-arrow": item.children,
                      active: item.active,
                    })}
                  >
                    {typeof item.icon === "string" ? (
                      <i className={`bx ${item.icon}`}></i>
                    ) : (
                      <>{item.icon}</>
                    )}
                    <span>{item.name}</span>
                  </a>
                  {item.children ? (
                    <>
                      {renderMenu(
                        item.children,
                        item.active || !layout.leftMenu
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <>
                  <Link
                    to={`${item.link ? item.link : ""}`}
                    onClick={() => onLinkClick(item)}
                    className={classNames({
                      "has-arrow": item.children,
                      active: item.active,
                    })}
                  >
                    {typeof item.icon === "string" ? (
                      <i className={`bx ${item.icon}`}></i>
                    ) : (
                      <>{item.icon}</>
                    )}
                    <span>{item.name}</span>
                  </Link>
                </>
              )}
            </li>
          ))}
        </Collapse>
      </ul>
    );
  };

  return (
    <React.Fragment>
      <SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
        <div id="sidebar-menu">{renderMenu(menuState, true)}</div>
      </SimpleBar>
    </React.Fragment>
  );
};

export default SidebarContent;

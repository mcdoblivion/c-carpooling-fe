import React, { useEffect } from "react";
import { Collapse } from "reactstrap";

import { useSelector } from "react-redux";
import classNames from "classnames";
import { NavLink, useHistory } from "react-router-dom";
import { menu, Menu } from "config/menu";

const Navbar = () => {
  const { leftMenu } = useSelector((state: any) => state.Layout);
  const [menuItems, setMenuItems] = React.useState<any>({});
  const [activeCurrent, setActiveCurrent] = React.useState<any>();
  const history = useHistory();

  const activateParentDropdown = React.useCallback(
    (item: any, rootNode: HTMLElement) => {
      item.classList.add("active");
      const parent = item.parentElement;
      if (parent && isDescendant(rootNode, parent)) {
        activateParentDropdown(parent, rootNode);
      } else return false;
    },
    []
  );

  const unActivateParentDropdown = React.useCallback(
    (item: any, rootNode: HTMLElement) => {
      item.classList.remove("active");
      const parent = item.parentElement;
      if (parent && isDescendant(rootNode, parent)) {
        unActivateParentDropdown(parent, rootNode);
      } else return false;
    },
    []
  );

  const handleActiveMenu = React.useCallback(
    (path: string) => {
      var matchingMenuItem = null;
      var ul = document.getElementById("navigation") as HTMLElement;
      var items = ul.getElementsByTagName("a");
      for (var i = 0; i < items.length; ++i) {
        var regex = new RegExp("^" + items[i].pathname);
        if (regex.test(path)) {
          matchingMenuItem = items[i];
          break;
        }
      }
      if (activeCurrent) {
        unActivateParentDropdown(activeCurrent, ul);
      }
      if (matchingMenuItem) {
        setActiveCurrent(matchingMenuItem);
        activateParentDropdown(matchingMenuItem, ul);
      }
    },
    [activateParentDropdown, activeCurrent, unActivateParentDropdown]
  );

  // set active menu when navigate
  useEffect(() => {
    return history.listen((location: any) => {
      handleActiveMenu(location.pathname);
    });
  }, [handleActiveMenu, history]);

  // set active using when f5
  useEffect(() => {
    if (menu && menu.length) {
      handleActiveMenu(window.location.pathname);
    }
  }, [handleActiveMenu]);

  function isDescendant(parent: HTMLElement, child: HTMLElement) {
    var node = child.parentNode;
    while (node != null) {
      if (node === parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }

  const handleToggleMenu = React.useCallback(
    (menu: Menu) => (event: any) => {
      event.preventDefault();
      const windowCurrentWidth = window.screen.availWidth;
      if (windowCurrentWidth <= 995) {
        setMenuItems({
          ...menuItems,
          [`${menu.name}`]:
            menuItems[`${menu.name}`] !== undefined
              ? !menuItems[`${menu.name}`]
              : true,
        });
      }
    },
    [menuItems]
  );

  const renderMenu = (menu: Menu, key: number, itemType?: string) => {
    return (
      <React.Fragment key={key}>
        {menu.children
          ? menu.show && (
              <>
                <NavLink
                  to={menu.link}
                  className={classNames("dropdown-toggle arrow-none", {
                    "nav-link": itemType === "nav",
                    "dropdown-item": !itemType,
                  })}
                  onClick={handleToggleMenu(menu)}
                >
                  {itemType === "nav" ? (
                    <>
                      {typeof menu.icon === "string" ? (
                        <i className={`bx ${menu.icon} me-2`}></i>
                      ) : (
                        <>{menu.icon}</>
                      )}
                      <span>{menu.name}</span>
                    </>
                  ) : (
                    <>{menu.name}</>
                  )}

                  <div className="arrow-down"></div>
                </NavLink>
                <div
                  className={classNames("dropdown-menu", {
                    show: menuItems[`${menu.name}`],
                  })}
                >
                  {menu.children.map((item: Menu, index: number) => (
                    <React.Fragment key={index}>
                      {item.children ? (
                        <div className="dropdown">
                          <>{renderMenu(item, index)}</>
                        </div>
                      ) : item.show ? (
                        item.link ? (
                          <NavLink to={item.link} className="dropdown-item">
                            {item.name}
                          </NavLink>
                        ) : (
                          <div className="dropdown-item">{item.name}</div>
                        )
                      ) : (
                        <></>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </>
            )
          : menu.show && (
              <>
                <NavLink className="dropdown-item" to={menu.link}>
                  {menu.name}
                </NavLink>
              </>
            )}
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <nav
        className="navbar navbar-light navbar-expand-lg topnav-menu"
        id="navigation"
      >
        <Collapse
          isOpen={leftMenu}
          className="navbar-collapse"
          id="topnav-menu-content"
        >
          <ul className="navbar-nav">
            {menu.map((item: Menu, index: number) => (
              <React.Fragment key={index}>
                {item.children ? (
                  <li className="nav-item dropdown">
                    {renderMenu(item, index, "nav")}
                  </li>
                ) : (
                  item.show && (
                    <li className="nav-item dropdown">
                      <NavLink to={item.link} className="nav-link">
                        {typeof item.icon === "string" ? (
                          <i className={`bx ${item.icon} me-2`}></i>
                        ) : (
                          <>{item.icon}</>
                        )}
                        <span>{item.name}</span>
                      </NavLink>
                    </li>
                  )
                )}
              </React.Fragment>
            ))}
          </ul>
        </Collapse>
      </nav>
    </React.Fragment>
  );
};

export default Navbar;

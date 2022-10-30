import React from "react";
import { Route, Switch } from "react-router-dom";
import App from "app/App";
import { Route as RouteInterface, userRoutes as routes } from "config/route";
import { SIDE_BAR_PAGE_ROUTE } from "config/route-consts";

/** Lazyload route  */
const lazyRoutes: RouteInterface[] = [
  {
    path: SIDE_BAR_PAGE_ROUTE,
    component: React.lazy(
      () => import(/* webpackChunkName: "[sidebar_page]" */ "./../SideBar")
    ),
  },
];

export const PrivateRoute = ({ ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        return (
          <React.Suspense fallback={<span>Loading...</span>}>
            <App>
              <Switch>
                {lazyRoutes &&
                  lazyRoutes.length > 0 &&
                  lazyRoutes.map(({ path, component: LazyComponent }) => (
                    <Route
                      key={path}
                      path={path}
                      render={() => {
                        return (
                          <React.Suspense fallback={<span>Loading...</span>}>
                            <LazyComponent />
                          </React.Suspense>
                        );
                      }}
                    ></Route>
                  ))}
                {routes &&
                  routes.length > 0 &&
                  routes.map(({ path, component }) => (
                    <Route key={path} path={path} component={component}></Route>
                  ))}
              </Switch>
            </App>
          </React.Suspense>
        );
      }}
    />
  );
};

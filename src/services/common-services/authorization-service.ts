import { useAppState } from "app/AppStore";
import { webService } from "./web-service";
import { ACTION_URL_REGEX } from "config/consts";
import { menu, Menu } from "config/menu";
import React from "react";
import { forkJoin } from "rxjs";
import { utilService } from "./util-service";
import _, { kebabCase } from "lodash";
import { AppActionEnum } from "app/AppReducer";
import { Model } from "react3l-common";
import authenticationService from "./authentication-service";
import store from "store";
import { userRepository } from "repositories/user-repository";
import { updateUser } from "store/global-state/actions";

export const authorizationService = {
  useAuthorizedApp() {
    const [subscription] = webService.useSubscription();
    const { appDispatch } = useAppState();
    const token = JSON.parse(localStorage.getItem("token"));

    React.useEffect(() => {
      subscription.add(
        userRepository.getMe(token).subscribe((result: Model) => {
          if (result) {
            store.dispatch(updateUser(result));
          } else {
            authenticationService.logout();
          }
        })
      );
    }, [subscription, token]);

    React.useEffect(() => {
      let isCancelled = false;
      if (!isCancelled) {
        appDispatch({
          type: AppActionEnum.SET_PERMISSION,
          permissionPaths: [],
          authorizedMenus: menu,
          authorizedAction: [],
          authorizedMenuMapper: [],
        });
        subscription.add(
          forkJoin([]).subscribe({
            next: (results: any[]) => {
              const response = [...results[0]];
              if (response && response.length > 0) {
                const authorizedMenuMapper: Record<string, number> = {};
                const authorizedAction: string[] = [];
                response.forEach((path: string, index: number) => {
                  if (path.match(ACTION_URL_REGEX)) {
                    authorizedAction.push(path);
                  } else {
                    authorizedMenuMapper[`/${path as string}`] = index;
                  }
                });
                const authorizedMenus: Menu[] = _.cloneDeep(menu);
                utilService.mapTreeMenu(authorizedMenus, authorizedMenuMapper);
                appDispatch({
                  type: AppActionEnum.SET_PERMISSION,
                  permissionPaths: [...response],
                  authorizedMenus,
                  authorizedAction,
                  authorizedMenuMapper,
                });
              } else {
                appDispatch({
                  type: AppActionEnum.SET_PERMISSION,
                  permissionPaths: [],
                  authorizedMenus: [],
                  authorizedAction: [],
                  authorizedMenuMapper: [],
                });
              }
            },
            error: () => {},
          })
        );
        return () => {
          isCancelled = true;
        };
      }
    }, [appDispatch, subscription]);

    return;
  },

  useAuthorizedAction(module: string, baseAction: string) {
    const { appState } = useAppState();
    const actionContext = React.useMemo(() => {
      return appState &&
        appState.authorizedAction &&
        appState.authorizedAction.length > 0
        ? appState.authorizedAction
        : [];
    }, [appState]);

    const [actionMapper, setActionMapper] = React.useState<
      Record<string, number>
    >({});

    React.useEffect(() => {
      const mapper: Record<string, number> = {};
      const regex = new RegExp(`^(${baseAction})/`, "i");
      actionContext.forEach((item: string, index: number) => {
        if (item.match(regex)) {
          mapper[item] = index;
        }
      });
      setActionMapper(mapper);
    }, [actionContext, module, baseAction]);
    const buildAction = React.useCallback(
      (action: string) => {
        return `${baseAction}/${kebabCase(action)}`;
      },
      [baseAction]
    );

    const validAction = React.useMemo(() => {
      return (action: string) => {
        if (
          !_.isEmpty(actionMapper) &&
          Object.prototype.hasOwnProperty.call(
            actionMapper,
            buildAction(action)
          )
        ) {
          return true;
        }
        return false;
      };
    }, [actionMapper, buildAction]);

    return { validAction };
  },

  useAuthorizedRoute() {
    const { appState } = useAppState();

    const mapper = React.useMemo(() => {
      return appState &&
        appState.authorizedMenuMapper &&
        appState.authorizedMenuMapper.length > 0
        ? appState.authorizedMenuMapper
        : [];
    }, [appState]);

    const auth = React.useCallback(
      (path: string) => {
        if (path.includes("dashboard-user")) {
          return true;
        }
        if (!_.isEmpty(mapper)) {
          if (
            Object.prototype.hasOwnProperty.call(mapper, "hasAnyPermission")
          ) {
            return true;
          }
          if (!Object.prototype.hasOwnProperty.call(mapper, path)) {
            return false;
          }
        }
        return true;
      },
      [mapper]
    );

    return {
      auth,
    };
  },
};

import { Modal } from "antd";
import { generalLanguageKeys } from "config/language-keys";
import React, { Reducer } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { Model, ModelFilter, Repository } from "react3l-common";
import { isEmpty } from "lodash";
import { FilterAction, FilterActionEnum } from "./filter-service";
const qs = require("qs");

export interface RepoState {
  tabKey: string;
  listRepo: Repository;
  countRepo: Repository;
}

interface RepoAction {
  type: string;
  data: RepoState;
}

function repositoryReducer(state: RepoState, action: RepoAction) {
  switch (action.type) {
    case "UPDATE":
      return { ...action.data };
    default:
      return { ...state };
  }
}

export const masterService = {
  /**
   * react hook for control list/count data from server
   * @param: routeView: string
   * @param: deleteAction?: (t: Model) => void
   * @return: { history,
      handleGoCreate,
      handleGoDetail,
      handleGoMaster,
      handleDeleteItem }
   * */
  useMasterAction(routeView: string, deleteAction?: (t: Model) => void) {
    const history = useHistory();
    const [translate] = useTranslation();

    const baseRoute = React.useMemo(() => {
      let listPath = routeView.split("/");
      const baseRoute = "/" + listPath[listPath.length - 1];
      return baseRoute;
    }, [routeView]);

    const handleGoCreate = React.useCallback(() => {
      history.push(`${routeView}${baseRoute}-detail`);
    }, [routeView, baseRoute, history]);

    const handleGoDetail = React.useCallback(
      (id: any) => {
        return () => {
          history.push(`${routeView}${baseRoute}-detail?id=${id}`);
        };
      },
      [routeView, baseRoute, history]
    );

    const handleGoMaster = React.useCallback(() => {
      history.replace(`${routeView}${baseRoute}-master`);
    }, [routeView, baseRoute, history]);

    const handleGoPreview = React.useCallback(
      (id: any) => {
        return () => {
          history.push(`${routeView}${baseRoute}-preview?id=${id}`);
        };
      },
      [routeView, baseRoute, history]
    );

    const handleGoApprove = React.useCallback(
      (id: any) => {
        return () => {
          history.push(`${routeView}${baseRoute}-approve?id=${id}`);
        };
      },
      [routeView, baseRoute, history]
    );

    const handleDeleteItem = React.useCallback(
      (item: Model) => (event: any) => {
        if (typeof deleteAction !== undefined) {
          Modal.confirm({
            title: translate(generalLanguageKeys.deletes.content),
            content: translate(generalLanguageKeys.deletes.title),
            cancelText: translate(generalLanguageKeys.deletes.cancel),
            okType: "danger",
            onOk() {
              deleteAction(item);
            },
          });
        }
      },
      [deleteAction, translate]
    );

    return {
      history,
      handleGoCreate,
      handleGoDetail,
      handleGoMaster,
      handleDeleteItem,
      handleGoPreview,
      handleGoApprove,
    };
  },

  /**
   *
   * react hook for manage multiple tab/repository
   * @param: tabRepositories: RepoState[]
   * @param: dispatchFilter: React.Dispatch<FilterAction<TFilter>>
   *
   * @return: { repo, dispatchRepo, handleChangeTab }
   *
   * */
  useTabRepository<TFilter extends ModelFilter>(
    tabRepositories: RepoState[],
    dispatchFilter: React.Dispatch<FilterAction<TFilter>>
  ) {
    const history = useHistory();
    const initRepo = React.useMemo<RepoState>(() => {
      const queryParam: any = qs.parse(history.location.search.substring(1));
      if (!isEmpty(queryParam) && queryParam.tabNumber) {
        const currentTabRepo: RepoState = tabRepositories.filter(
          (currentItem) => currentItem.tabKey === queryParam.tabNumber
        )[0];
        return currentTabRepo;
      }
      return tabRepositories[0];
    }, [history, tabRepositories]);

    const [repo, dispatchRepo] = React.useReducer<
      Reducer<RepoState, RepoAction>
    >(repositoryReducer, initRepo);

    const handleChangeTab = React.useCallback(
      (activeTabKey: string) => {
        const currentTabRepo: RepoState = tabRepositories.filter(
          (currentItem) => currentItem.tabKey === activeTabKey
        )[0];
        if (currentTabRepo) {
          dispatchRepo({
            type: "UPDATE",
            data: currentTabRepo,
          });
          dispatchFilter({
            type: FilterActionEnum.SET,
            payload: { ...new ModelFilter(), skip: 0, take: 10 } as TFilter,
          });
        }
      },
      [dispatchFilter, tabRepositories]
    );

    return {
      repo,
      dispatchRepo,
      handleChangeTab,
    };
  },
};

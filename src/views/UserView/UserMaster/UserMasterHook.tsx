import { USER_PREVIEW_ROUTE, USER_ROUTE } from "config/route-consts";
import { AppUser, AppUserFilter } from "models/AppUser";
import { Reducer, useCallback, useEffect, useReducer, useState } from "react";
import { useHistory } from "react-router";
import { userRepository } from "repositories/user-repository";
import { finalize, forkJoin } from "rxjs";
import { webService } from "services/common-services/web-service";
import {
  FilterActionEnum,
  filterService,
} from "services/page-services/filter-service";
import {
  ListAction,
  ListActionType,
  listReducer,
  ListState,
} from "services/page-services/list-service";
import { queryStringService } from "services/page-services/query-string-service";
import {
  getAntOrderType,
  getOrderType,
} from "services/page-services/table-service";

export default function useUserMaster() {
  const autoCallListByChange: boolean = true;
  const [modelFilter, dispatchFilter] = queryStringService.useQueryString(
    AppUserFilter,
    { page: 1, limit: 10 }
  );
  const history = useHistory();

  const {
    value: filter,
    handleChangeSelectFilter,
    handleChangeMultipleSelectFilter,
    handleChangeDateMasterFilter,
    handleChangeInputSearch,
    handleChangeAllFilter,
  } = filterService.useFilter(modelFilter, dispatchFilter);

  const [{ list, count }, dispatch] = useReducer<
    Reducer<ListState<AppUser>, ListAction<AppUser>>
  >(listReducer, { list: [], count: 0 });

  const [loadingList, setLoadingList] = useState<boolean>(false);

  const [defaultFilter] = useState<AppUserFilter>({
    ...filter,
    page: 1,
    limit: 10,
  });

  const [subscription] = webService.useSubscription();

  const handleLoadList = useCallback(
    (filterParam?: AppUserFilter) => {
      const filterValue = filterParam ? { ...filterParam } : { ...filter };
      subscription.add(
        forkJoin([userRepository.getUsers(filterValue), userRepository.all()])
          .pipe(finalize(() => setLoadingList(false)))
          .subscribe(
            (res: [any, any]) => {
              dispatch({
                type: ListActionType.SET,
                payload: {
                  list: res[0].data.records,
                  count: res[1].data.length,
                },
              });
            },
            (err) => {
              dispatch({
                type: ListActionType.SET,
                payload: {
                  list: [],
                  count: null,
                },
              });
            }
          )
      );
    },
    [filter, subscription]
  );

  const handleResetList = useCallback(() => {
    dispatchFilter({
      type: FilterActionEnum.UPDATE,
      payload: {
        ...defaultFilter,
      },
    });
  }, [defaultFilter, dispatchFilter]);

  const handleDelete = useCallback(
    (id) => {
      userRepository.delete(id).subscribe((res) => handleLoadList(filter));
    },
    [filter, handleLoadList]
  );

  useEffect(() => {
    if (filter && autoCallListByChange) {
      setLoadingList(true);
      handleLoadList();
    }
  }, [autoCallListByChange, filter, handleLoadList]);

  const handleTableChange = useCallback(
    (...[, , sorter]) => {
      let newFilter = { ...filter }; // dont check pagination change because of we customize it
      if (
        sorter.field !== filter.sort ||
        sorter.order !== getAntOrderType(filter, sorter.field)
      ) {
        newFilter = {
          ...newFilter,
          sort: sorter.field,
          order: getOrderType(sorter.order),
        };
      } // check sortOrder and sortDirection
      handleChangeAllFilter({ ...newFilter }); // setFilter
    },
    [filter, handleChangeAllFilter]
  );

  const handlePagination = useCallback(
    (skip: number, take: number) => {
      handleChangeAllFilter({ ...filter, page: skip / take + 1, limit: take });
    },
    [handleChangeAllFilter, filter]
  );
  const { handleGoDetail, handleGoDetailWithId } =
    webService.usePage(USER_ROUTE);

  const handleGoPreview = useCallback(
    (id: any) => {
      return () => {
        history.push(`${USER_PREVIEW_ROUTE}?id=${id}`);
      };
    },
    [history]
  );

  return {
    filter,
    list,
    count,
    loadingList,
    setLoadingList,
    handleResetList,
    handleLoadList,
    handleChangeSelectFilter,
    handleChangeMultipleSelectFilter,
    handleChangeDateMasterFilter,
    handleChangeInputSearch,
    handleChangeAllFilter,
    handleTableChange,
    handlePagination,
    handleGoPreview,
    handleGoDetail,
    handleGoDetailWithId,
    handleDelete,
  };
}

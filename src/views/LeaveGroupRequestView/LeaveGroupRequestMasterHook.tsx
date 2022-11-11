import { USER_ROUTE } from "config/route-consts";
import { AppUser, AppUserFilter } from "models/AppUser";
import { Reducer, useCallback, useEffect, useReducer, useState } from "react";
import { leaveGroupRequestRepository } from "repositories/leave-group-request-repository";

import { finalize } from "rxjs";
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

export default function useLeaveGroupRequestMaster() {
  const autoCallListByChange: boolean = true;
  const [modelFilter, dispatchFilter] = queryStringService.useQueryString(
    AppUserFilter,
    { page: 1, limit: 10, userId: null, carpoolingGroupId: null }
  );

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

  const [defaultFilter] = useState<any>({
    ...filter,
    page: 1,
    limit: 10,
    userId: null,
    carpoolingGroupId: null,
  });

  const [subscription] = webService.useSubscription();

  const handleLoadList = useCallback(
    (filterParam?: any) => {
      const filterValue = filterParam ? { ...filterParam } : { ...filter };
      subscription.add(
        leaveGroupRequestRepository
          .getLeaveGroupRequests(filterValue)
          .pipe(finalize(() => setLoadingList(false)))
          .subscribe(
            (res) => {
              dispatch({
                type: ListActionType.SET,
                payload: {
                  list: res.data.records,
                  count: res.data.totalPages,
                },
              });
            },
            (err) => {
              dispatch({
                type: ListActionType.SET,
                payload: {
                  list: [],
                  count: 0,
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
  const { handleGoPreview, handleGoDetail, handleGoDetailWithId } =
    webService.usePage(USER_ROUTE);

  const handleChangeAppUserFilter = useCallback(
    (value) => {
      handleChangeAllFilter({ ...filter, userId: value });
    },
    [handleChangeAllFilter, filter]
  );
  const handleChangeGroupFilter = useCallback(
    (value) => {
      handleChangeAllFilter({ ...filter, carpoolingGroupId: value });
    },
    [handleChangeAllFilter, filter]
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
    handleChangeAppUserFilter,
    handleChangeGroupFilter,
  };
}

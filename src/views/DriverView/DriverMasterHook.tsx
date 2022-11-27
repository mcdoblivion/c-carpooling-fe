import { AppUser, AppUserFilter } from "models/AppUser";
import { Reducer, useCallback, useEffect, useReducer, useState } from "react";
import { driverRepository } from "repositories/driver-repository";
import { finalize, Observable } from "rxjs";
import { webService } from "services/common-services/web-service";
import { filterService } from "services/page-services/filter-service";
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

export default function useDriverMaster() {
  const autoCallListByChange: boolean = true;
  const [modelFilter, dispatchFilter] = queryStringService.useQueryString(
    AppUserFilter,
    { page: 1, limit: 10, status: null }
  );

  const { value: filter, handleChangeAllFilter } = filterService.useFilter(
    modelFilter,
    dispatchFilter
  );

  const [{ list, count }, dispatch] = useReducer<
    Reducer<ListState<AppUser>, ListAction<AppUser>>
  >(listReducer, { list: [], count: 0 });

  const [loadingList, setLoadingList] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<any>(null);

  const [subscription] = webService.useSubscription();

  const handleLoadList = useCallback(
    (filterParam?: any) => {
      const filterValue = filterParam ? { ...filterParam } : { ...filter };
      subscription.add(
        driverRepository
          .getDrivers(filterValue)
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

  useEffect(() => {
    if (filter && autoCallListByChange) {
      setLoadingList(true);
      handleLoadList();
    }
  }, [autoCallListByChange, filter, handleLoadList]);

  useEffect(() => {
    document.title = "Quản lý tài xế";
  }, []);

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

  const handleVerify = useCallback(
    (id, status) => {
      setLoadingList(true);
      driverRepository
        .verify(id, { status: status })
        .pipe(finalize(() => setLoadingList(false)))
        .subscribe((res) => handleLoadList(filter));
    },
    [filter, handleLoadList]
  );
  const statusObservable = new Observable<any[]>((observer) => {
    setTimeout(() => {
      observer.next([
        { id: 1, name: "Accepted", code: "Accepted" },
        { id: 2, name: "Rejected", code: "Rejected" },
        { id: 3, name: "Pending", code: "Pending" },
      ]);
    }, 1000);
  });
  const statusSearchFunc = (TModelFilter?: any) => {
    return statusObservable;
  };
  const handleChangeStatusFilter = useCallback(
    (value, object) => {
      handleChangeAllFilter({
        ...filter,
        statusId: value,
        status: object?.name,
        statusValue: object,
      });
    },
    [handleChangeAllFilter, filter]
  );

  const handleGoPreview = useCallback(
    (model: AppUser) => {
      setCurrentItem(model);
      setVisible(true);
    },
    [setCurrentItem, setVisible]
  );
  const handleClosePreview = useCallback(() => {
    setVisible(false);
  }, [setVisible]);
  return {
    filter,
    list,
    count,
    loadingList,
    visible,
    currentItem,
    handleTableChange,
    handlePagination,
    statusSearchFunc,
    handleVerify,
    handleChangeStatusFilter,
    handleGoPreview,
    handleClosePreview,
  };
}

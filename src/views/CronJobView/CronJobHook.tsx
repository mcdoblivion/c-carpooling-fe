import { AppUser, AppUserFilter } from "models/AppUser";
import { Reducer, useCallback, useEffect, useReducer, useState } from "react";
import { cronJobRepository } from "repositories/cron-jobs-repository";

import { finalize, Observable } from "rxjs";
import appMessageService from "services/common-services/app-message-service";
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
import { handleErrorNoti } from "views/AddressView/AddressHook";
const { notifyUpdateItemSuccess } = appMessageService.useCRUDMessage();

export default function useCronJob() {
  const autoCallListByChange: boolean = true;
  const [modelFilter, dispatchFilter] = queryStringService.useQueryString(
    AppUserFilter,
    {
      type: null,
      isProcessed: null,
      page: 1,
      limit: 10,
      sort: "date",
    }
  );

  const { value: filter, handleChangeAllFilter } = filterService.useFilter(
    modelFilter,
    dispatchFilter
  );

  const [{ list, count }, dispatch] = useReducer<
    Reducer<ListState<AppUser>, ListAction<AppUser>>
  >(listReducer, { list: [], count: 0 });

  const [loadingList, setLoadingList] = useState<boolean>(false);

  const [subscription] = webService.useSubscription();

  const handleLoadList = useCallback(
    (filterParam?: any) => {
      const filterValue = filterParam ? { ...filterParam } : { ...filter };
      subscription.add(
        cronJobRepository
          .getCronJobs(filterValue)
          .pipe(finalize(() => setLoadingList(false)))
          .subscribe(
            (res) => {
              dispatch({
                type: ListActionType.SET,
                payload: {
                  list: res.data.records,
                  count: res.data.total,
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

  const triggerCronJob = useCallback(
    (id: number) => {
      cronJobRepository.triggerCronJob(id).subscribe(
        (res) => {
          notifyUpdateItemSuccess();
          handleLoadList();
        },
        (error) => {
          handleErrorNoti(error);
        }
      );
      handleLoadList();
    },
    [handleLoadList]
  );

  useEffect(() => {
    if (filter && autoCallListByChange) {
      setLoadingList(true);
      handleLoadList();
    }
  }, [autoCallListByChange, filter, handleLoadList]);

  useEffect(() => {
    document.title = "Quản lý tác vụ";
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

  const handleChangeFilter = useCallback(
    (field: string) => (value: any, object: any) => {
      handleChangeAllFilter({
        ...filter,
        [field]: object?.code || null,
        [`${field}Value`]: object,
      });
    },
    [handleChangeAllFilter, filter]
  );

  const jobTypeObservable = new Observable<any[]>((observer) => {
    setTimeout(() => {
      observer.next([
        { id: 1, name: "Leave group request", code: "Leave group request" },
        { id: 2, name: "Carpooling log", code: "Carpooling log" },
      ]);
    }, 500);
  });
  const getJobTypes = (TModelFilter?: any) => {
    return jobTypeObservable;
  };

  const isProcessedObservable = new Observable<any[]>((observer) => {
    setTimeout(() => {
      observer.next([
        { id: 1, name: "Completed", code: "true" },
        { id: 2, name: "Uncompleted", code: "false" },
      ]);
    }, 500);
  });
  const getIsProcessedStatuses = (TModelFilter?: any) => {
    return isProcessedObservable;
  };

  return {
    filter,
    list,
    count,
    loadingList,
    handleTableChange,
    handlePagination,
    handleChangeFilter,
    getJobTypes,
    getIsProcessedStatuses,
    triggerCronJob,
  };
}

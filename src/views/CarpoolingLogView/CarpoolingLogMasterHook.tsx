import { AppUser, AppUserFilter } from "models/AppUser";
import { Reducer, useCallback, useEffect, useReducer, useState } from "react";
import { carpoolingGroupRepository } from "repositories/carpooling-group-repository";
import { carpoolingLogRepository } from "repositories/carpooling-logs-repository";
import { userRepository } from "repositories/user-repository";

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

export default function useCarpoolingLogMaster() {
  const autoCallListByChange: boolean = true;
  const [modelFilter, dispatchFilter] = queryStringService.useQueryString(
    AppUserFilter,
    {
      page: 1,
      limit: 10,
      userId: null,
      carpoolingGroupId: null,
      isAbsent: null,
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

  // const [defaultFilter] = useState<any>({
  //   ...filter,
  //   page: 1,
  //   limit: 10,
  //   userId: null,
  //   carpoolingGroupId: null,
  // });

  const [subscription] = webService.useSubscription();

  const handleLoadList = useCallback(
    (filterParam?: any) => {
      const filterValue = filterParam ? { ...filterParam } : { ...filter };
      subscription.add(
        carpoolingLogRepository
          .getCarpoolingLogs(filterValue)
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

  // const handleResetList = useCallback(() => {
  //   dispatchFilter({
  //     type: FilterActionEnum.UPDATE,
  //     payload: {
  //       ...defaultFilter,
  //     },
  //   });
  // }, [defaultFilter, dispatchFilter]);

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

  const handleChangeDirectionTypeFilter = useCallback(
    (value, object) => {
      handleChangeAllFilter({
        ...filter,
        directionTypeId: value,
        directionType: object?.name,
        directionTypeValue: object,
      });
    },
    [handleChangeAllFilter, filter]
  );

  const handleChangeStatusFilter = useCallback(
    (value, object) => {
      handleChangeAllFilter({
        ...filter,
        isAbsent: object
          ? object?.name === "Có tham gia"
            ? false
            : true
          : null,
        statusValue: object,
      });
    },
    [handleChangeAllFilter, filter]
  );

  const handleChangeDateFilter = useCallback(
    (value, object) => {
      const formatDate = new Date(value);
      const year = formatDate.getFullYear();
      const month = formatDate.getMonth() + 1;
      const day = formatDate.getDate();
      const newDate = `${year}-${month < 10 ? `0${month}` : month}-${
        day < 10 ? `0${day}` : day
      }`;
      handleChangeAllFilter({
        ...filter,
        date: value ? newDate : null,
        dateValue: value,
      });
    },
    [filter, handleChangeAllFilter]
  );
  const handleChangeSelectFilter = useCallback(
    (field) => (value: any, object: any) => {
      handleChangeAllFilter({
        ...filter,
        [`${field}Id`]: value,
        [`${field}`]: object,
      });
    },
    [handleChangeAllFilter, filter]
  );

  const appUserObservable = new Observable<any[]>((observer) => {
    userRepository.all().subscribe((res) => {
      setTimeout(() => {
        observer.next(res?.data);
      }, 1000);
    });
  });
  const appUserSearchFunc = (TModelFilter?: any) => {
    return appUserObservable;
  };
  const groupObservable = new Observable<any[]>((observer) => {
    carpoolingGroupRepository.search(new AppUserFilter()).subscribe((res) => {
      setTimeout(() => {
        observer.next(res?.data?.records);
      }, 1000);
    });
  });
  const groupSearchFunc = (TModelFilter?: any) => {
    return groupObservable;
  };

  const directionTypeObservable = new Observable<any[]>((observer) => {
    setTimeout(() => {
      observer.next([
        { id: 1, name: "Home to Work", code: "HTW" },
        { id: 2, name: "Work to Home", code: "WTH" },
      ]);
    }, 1000);
  });
  const directionTypeSearchFunc = (TModelFilter?: any) => {
    return directionTypeObservable;
  };
  const statusObservable = new Observable<any[]>((observer) => {
    setTimeout(() => {
      observer.next([
        { id: 1, name: "Có tham gia", code: "join" },
        { id: 2, name: "Nghỉ phép", code: "absent" },
      ]);
    }, 1000);
  });
  const statusSearchFunc = (TModelFilter?: any) => {
    return statusObservable;
  };
  return {
    filter,
    list,
    count,
    loadingList,
    handleTableChange,
    handlePagination,
    handleChangeSelectFilter,
    handleChangeDirectionTypeFilter,
    handleChangeStatusFilter,
    handleChangeDateFilter,
    appUserSearchFunc,
    groupSearchFunc,
    directionTypeSearchFunc,
    statusSearchFunc,
  };
}

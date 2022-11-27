import { AppUser, AppUserFilter } from "models/AppUser";
import { Reducer, useCallback, useEffect, useReducer, useState } from "react";
import { carpoolingGroupRepository } from "repositories/carpooling-group-repository";
import { leaveGroupRequestRepository } from "repositories/leave-group-request-repository";
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

export default function useLeaveGroupRequestMaster() {
  const autoCallListByChange: boolean = true;
  const [modelFilter, dispatchFilter] = queryStringService.useQueryString(
    AppUserFilter,
    {
      page: 1,
      limit: 10,
      userId: null,
      carpoolingGroupId: null,
      sort: "date",
      order: "ASC",
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
        leaveGroupRequestRepository
          .getLeaveGroupRequests(filterValue)
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

  useEffect(() => {
    document.title = "Quản lý yêu cầu rời nhóm";
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

  const handleChangeAppUserFilter = useCallback(
    (value, object) => {
      handleChangeAllFilter({ ...filter, userId: value, user: object });
    },
    [handleChangeAllFilter, filter]
  );
  const handleChangeGroupFilter = useCallback(
    (value, object) => {
      handleChangeAllFilter({
        ...filter,
        carpoolingGroupId: value,
        carpoolingGroup: object,
      });
    },
    [handleChangeAllFilter, filter]
  );

  const appUserObservable = new Observable<any[]>((observer) => {
    userRepository.getUsers(new AppUserFilter()).subscribe((res) => {
      setTimeout(() => {
        observer.next(res?.data?.records);
      }, 500);
    });
  });
  const appUserSearchFunc = (TModelFilter?: any) => {
    return appUserObservable;
  };
  const groupObservable = new Observable<any[]>((observer) => {
    carpoolingGroupRepository.search(new AppUserFilter()).subscribe((res) => {
      setTimeout(() => {
        observer.next(res?.data?.records);
      }, 500);
    });
  });
  const groupSearchFunc = (TModelFilter?: any) => {
    return groupObservable;
  };

  return {
    filter,
    list,
    count,
    loadingList,
    handleTableChange,
    handlePagination,
    handleChangeAppUserFilter,
    handleChangeGroupFilter,
    appUserSearchFunc,
    groupSearchFunc,
  };
}

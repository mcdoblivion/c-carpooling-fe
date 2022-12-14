import { AppUser, AppUserFilter } from "models/AppUser";
import {
  Reducer,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { carpoolingGroupRepository } from "repositories/carpooling-group-repository";
import { dayOffRequestRepository } from "repositories/day-off-requests-repository";
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

export default function useDayOffRequestNormal() {
  const token = JSON.parse(localStorage.getItem("token"));
  const [user, setUser] = useState(new AppUser());
  const firstLoad = useRef(true);

  useEffect(() => {
    if (firstLoad) {
      userRepository.getMe(token).subscribe((res) => setUser(res?.data));
      firstLoad.current = false;
    }
  }, [token]);

  useEffect(() => {
    document.title = "Yêu cầu nghỉ phép";
  }, []);

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

  const [subscription] = webService.useSubscription();

  const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
  const [visiblePreview, setVisiblePreview] = useState<boolean>(false);

  const [currentItem, setCurrentItem] = useState<any>({
    ...new AppUser(),
    carpoolingGroupId: user?.carpoolingGroupId,
  });

  const handleLoadList = useCallback(
    (filterParam?: any) => {
      const filterValue = filterParam ? { ...filterParam } : { ...filter };
      subscription.add(
        dayOffRequestRepository
          .getDayOffRequests(filterValue)
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

  const appUserObservable = new Observable<any[]>((observer) => {
    userRepository.all().subscribe((res) => {
      setTimeout(() => {
        observer.next(res?.data);
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

  const directionTypeObservable = new Observable<any[]>((observer) => {
    setTimeout(() => {
      observer.next([
        { id: 1, name: "Home to Work", code: "HTW" },
        { id: 2, name: "Work to Home", code: "WTH" },
      ]);
    }, 500);
  });
  const directionTypeSearchFunc = (TModelFilter?: any) => {
    return directionTypeObservable;
  };

  const handleDelete = useCallback(
    (id) => {
      dayOffRequestRepository
        .delete(id)
        .subscribe((res) => handleLoadList(filter));
    },
    [filter, handleLoadList]
  );
  const handleGoCreate = useCallback(() => {
    setCurrentItem({
      ...new AppUser(),
      carpoolingGroupId: user?.carpoolingGroupId,
    });
    setVisibleDetail(true);
  }, [user?.carpoolingGroupId]);

  const handleGoDetail = useCallback((model: AppUser) => {
    setVisibleDetail(true);
    setVisiblePreview(false);
    setCurrentItem(model);
  }, []);

  const handleGoPreview = useCallback(
    (model: AppUser) => {
      setCurrentItem(model);
      setVisiblePreview(true);
      setVisibleDetail(false);
    },
    [setCurrentItem]
  );
  const handleClosePreview = useCallback(() => {
    setVisiblePreview(false);
  }, []);
  const handleCloseDetail = useCallback(() => {
    setVisibleDetail(false);
  }, []);

  return {
    filter,
    list,
    count,
    loadingList,
    visibleDetail,
    visiblePreview,
    currentItem,
    handleCloseDetail,
    handleClosePreview,
    handleTableChange,
    handlePagination,
    handleChangeDirectionTypeFilter,
    appUserSearchFunc,
    groupSearchFunc,
    directionTypeSearchFunc,
    handleDelete,
    handleGoCreate,
    handleGoPreview,
    handleGoDetail,
    handleLoadList,
  };
}

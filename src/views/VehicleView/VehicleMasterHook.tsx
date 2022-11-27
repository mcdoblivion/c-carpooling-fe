import { AppUser, AppUserFilter } from "models/AppUser";
import { Reducer, useCallback, useEffect, useReducer, useState } from "react";
import { vehicleRepository } from "repositories/vehicles-repository";
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

export default function useVehicleMaster() {
  const autoCallListByChange: boolean = true;
  const [modelFilter, dispatchFilter] = queryStringService.useQueryString(
    AppUserFilter,
    { page: 1, limit: 10, fuelType: null, isVerified: null }
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
        vehicleRepository
          .getVehicles(filterValue)
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

  useEffect(() => {
    document.title = "Quản lý phương tiện";
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
    (id) => {
      setLoadingList(true);
      vehicleRepository.verify(id).subscribe((res) => handleLoadList(filter));
    },
    [filter, handleLoadList]
  );
  const fuelTypeObservable = new Observable<any[]>((observer) => {
    setTimeout(() => {
      observer.next([
        { id: 1, name: "Gasoline", code: "1" },
        { id: 2, name: "Diesel", code: "2" },
      ]);
    }, 500);
  });
  const fuelTypeSearchFunc = (TModelFilter?: any) => {
    return fuelTypeObservable;
  };
  const isVerifiedObservable = new Observable<any[]>((observer) => {
    setTimeout(() => {
      observer.next([
        { id: 1, name: "Đã xác minh", code: "3" },
        { id: 2, name: "Chưa xác minh", code: "4" },
      ]);
    }, 500);
  });
  const isVerifiedSearchFunc = (TModelFilter?: any) => {
    return isVerifiedObservable;
  };
  const handleChangeFuelTypeFilter = useCallback(
    (value, object) => {
      handleChangeAllFilter({
        ...filter,
        fuelTypeId: value,
        fuelType: object?.name,
        fuelTypeValue: object,
      });
    },
    [handleChangeAllFilter, filter]
  );

  const handleChangeVerifiedFilter = useCallback(
    (value, object) => {
      handleChangeAllFilter({
        ...filter,
        isVerified: object
          ? object.name === "Đã xác minh"
            ? true
            : false
          : null,
        verifiedValue: object,
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
    fuelTypeSearchFunc,
    isVerifiedSearchFunc,
    handleVerify,
    handleChangeFuelTypeFilter,
    handleChangeVerifiedFilter,
    handleGoPreview,
    handleClosePreview,
  };
}

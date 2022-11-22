import { AppUser } from "models/AppUser";
import { Reducer, useCallback, useReducer, useState } from "react";
import { carpoolingGroupRepository } from "repositories/carpooling-group-repository";

import { finalize } from "rxjs";
import { webService } from "services/common-services/web-service";
import {
  ListAction,
  ListActionType,
  listReducer,
  ListState,
} from "services/page-services/list-service";

export default function useCarpoolingGroupFinding() {
  const user = JSON.parse(localStorage.getItem("currentUserInfo"));

  const [{ list }, dispatch] = useReducer<
    Reducer<ListState<AppUser>, ListAction<AppUser>>
  >(listReducer, { list: [], count: 0 });

  const [loadingList, setLoadingList] = useState<boolean>(false);

  const [subscription] = webService.useSubscription();

  const [departureTimeValue, setDepartureTimeValue] =
    useState<string>(undefined);
  const [comebackTimeValue, setComebackTimeValue] = useState<string>(undefined);
  const [departureTime, setDepartureTime] = useState<string>(undefined);
  const [comebackTime, setComebackTime] = useState<string>(undefined);

  const [visiblePreview, setVisiblePreview] = useState<boolean>(false);

  const [currentItem, setCurrentItem] = useState<any>({
    ...new AppUser(),
    carpoolingGroupId: user?.carpoolingGroupId,
  });

  const handleFindingGroup = useCallback(() => {
    if (departureTimeValue && comebackTimeValue) {
      const filterValue = {
        departureTime: departureTimeValue,
        comebackTime: comebackTimeValue,
      };
      subscription.add(
        carpoolingGroupRepository
          .findCarpoolingGroups(filterValue)
          .pipe(finalize(() => setLoadingList(false)))
          .subscribe(
            (res) => {
              dispatch({
                type: ListActionType.SET,
                payload: {
                  list: res?.data?.carpoolingGroups,
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
    }
  }, [comebackTimeValue, departureTimeValue, subscription]);

  const handleChangeTimeFilter = useCallback(
    (field) => (value: any, timeString: any) => {
      if (field === "comebackTime") {
        setComebackTimeValue(timeString);
        setComebackTime(value);
      } else {
        setDepartureTimeValue(timeString);
        setDepartureTime(value);
      }
    },
    []
  );

  const handleGoCreate = useCallback(() => {
    setCurrentItem({
      ...new AppUser(),
      carpoolingGroupId: user?.carpoolingGroupId,
    });
  }, [user?.carpoolingGroupId]);

  const handleGoDetail = useCallback((model: AppUser) => {
    setVisiblePreview(false);
    setCurrentItem(model);
  }, []);

  const handleGoPreview = useCallback(
    (model: AppUser) => {
      setCurrentItem(model);
      setVisiblePreview(true);
    },
    [setCurrentItem]
  );
  const handleClosePreview = useCallback(() => {
    setVisiblePreview(false);
  }, []);
  const handleCloseDetail = useCallback(() => {}, []);
  return {
    list,
    departureTime,
    comebackTime,
    loadingList,
    visiblePreview,
    currentItem,
    handleCloseDetail,
    handleClosePreview,
    handleChangeTimeFilter,
    handleGoCreate,
    handleGoPreview,
    handleGoDetail,
    handleFindingGroup,
  };
}

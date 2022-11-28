import { AppUser } from "models/AppUser";
import { Reducer, useCallback, useReducer, useState } from "react";
import { carpoolingGroupRepository } from "repositories/carpooling-group-repository";

import { finalize } from "rxjs";
import appMessageService from "services/common-services/app-message-service";
import { webService } from "services/common-services/web-service";
import {
  ListAction,
  ListActionType,
  listReducer,
  ListState,
} from "services/page-services/list-service";
import { handleErrorNoti } from "views/AddressView/AddressHook";

export default function useCarpoolingGroupFinding(reloadUser: () => void) {
  const [{ list }, dispatch] = useReducer<
    Reducer<ListState<AppUser>, ListAction<AppUser>>
  >(listReducer, { list: [], count: 0 });

  const [loadingList, setLoadingList] = useState<boolean>(false);

  const [subscription] = webService.useSubscription();

  const [departureTimeValue, setDepartureTimeValue] = useState<string>("08:25");
  const [comebackTimeValue, setComebackTimeValue] = useState<string>("17:30");
  const [departureTime, setDepartureTime] = useState<string>(undefined);
  const [comebackTime, setComebackTime] = useState<string>(undefined);
  const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
  const [visiblePreview, setVisiblePreview] = useState<boolean>(false);
  const [visiblePopupFee, setVisiblePopupFee] = useState<boolean>(false);
  const [popupFeeContent, setPopupFeeContent] = useState<AppUser>(
    new AppUser()
  );
  const { notifyUpdateItemSuccess } = appMessageService.useCRUDMessage();

  const [currentItem, setCurrentItem] = useState<any>(new AppUser());

  const handleFindingGroup = useCallback(() => {
    if (departureTimeValue && comebackTimeValue) {
      setLoadingList(true);

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

  const handleGoPreview = useCallback(
    (model: AppUser) => {
      const homeDistance = model?.homeDistance;
      const workDistance = model?.workDistance;

      carpoolingGroupRepository
        .getCarpoolingGroups(model?.id)
        .subscribe((res) => {
          setCurrentItem({ ...res?.data, homeDistance, workDistance });
          setVisiblePreview(true);
          setVisibleDetail(false);
        });
    },
    [setCurrentItem]
  );
  const handleClosePreview = useCallback(() => {
    setVisiblePreview(false);
  }, []);
  const handleOpenPopupFee = useCallback(() => {
    carpoolingGroupRepository.getFee(currentItem?.id).subscribe((res) => {
      setPopupFeeContent(res?.data);
      setVisiblePopupFee(true);
    });
  }, [currentItem?.id]);

  const handleClosePopupFee = useCallback(() => {
    setVisiblePopupFee(false);
  }, [setVisiblePopupFee]);

  const handleConfirm = useCallback(() => {
    carpoolingGroupRepository.join(currentItem?.id).subscribe(
      (res) => {
        notifyUpdateItemSuccess();
        reloadUser();
      },
      (error) => {
        handleErrorNoti(error);
      }
    );
    setVisiblePopupFee(false);
  }, [currentItem?.id, notifyUpdateItemSuccess, reloadUser]);

  const handleGoCreate = useCallback(() => {
    setVisibleDetail(true);
  }, []);
  const handleCloseDetail = useCallback(() => {
    setVisibleDetail(false);
  }, []);
  return {
    list,
    loadingList,
    visiblePreview,
    visibleDetail,
    currentItem,
    departureTime,
    comebackTime,
    popupFeeContent,
    visiblePopupFee,
    handleConfirm,
    handleClosePopupFee,
    handleClosePreview,
    handleChangeTimeFilter,
    handleGoPreview,
    handleFindingGroup,
    handleOpenPopupFee,
    handleCloseDetail,
    handleGoCreate,
  };
}

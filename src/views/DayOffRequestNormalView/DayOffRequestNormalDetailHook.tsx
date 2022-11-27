import { useCallback, useEffect, useRef, useState } from "react";
import { Observable } from "rxjs";
import appMessageService from "services/common-services/app-message-service";
import { AppUser } from "models/AppUser";
import { dayOffRequestRepository } from "repositories/day-off-requests-repository";
import { handleErrorNoti } from "views/AddressView/AddressHook";

export default function useDayOffRequestNormalDetail(
  model: AppUser,
  handleClose?: () => void
) {
  const [currentModel, setCurrentModel] = useState(null);

  const firstLoad = useRef(true);
  useEffect(() => {
    if (firstLoad) {
      if (model.id) {
        if (model?.directionType === "Home to Work") {
          model.directionTypeValue = {
            id: 1,
            name: "Home to Work",
            code: "HTW",
          };
        } else {
          model.directionTypeValue = {
            id: 2,
            name: "Work to Home",
            code: "WTH",
          };
        }
      }
      setCurrentModel(model);
      firstLoad.current = false;
    }
  }, [model]);

  const { notifyUpdateItemSuccess } = appMessageService.useCRUDMessage();

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

  const handleChangeDayOfRequest = useCallback(
    (fieldName: string) => (value: any) => {
      const newModel = { ...currentModel };
      if (fieldName === "date") {
        const formatDate = new Date(value);
        const year = formatDate.getFullYear();
        const month = formatDate.getMonth() + 1;
        const day = formatDate.getDate();
        const newDate = `${year}-${month < 10 ? `0${month}` : month}-${
          day < 10 ? `0${day}` : day
        }`;
        newModel["date"] = newDate;
      } else {
        if (value === 1) {
          newModel["directionType"] = "Home to Work";
          newModel["directionTypeValue"] = {
            id: 1,
            name: "Home to Work",
            code: "HTW",
          };
        } else {
          newModel[fieldName] = "Work to Home";
          newModel["directionTypeValue"] = {
            id: 2,
            name: "Work to Home",
            code: "WTH",
          };
        }
      }
      setCurrentModel(newModel);
    },
    [currentModel]
  );

  const handleSave = useCallback(() => {
    dayOffRequestRepository.save(currentModel).subscribe(
      (res) => {
        notifyUpdateItemSuccess();
        handleClose();
      },
      (error) => {
        if (error.response && error.response.status === 400)
          handleErrorNoti(error);
      }
    );
  }, [currentModel, handleClose, notifyUpdateItemSuccess]);

  return {
    currentModel,
    directionTypeSearchFunc,
    handleChangeDayOfRequest,
    handleSave,
  };
}

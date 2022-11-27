import { useCallback, useEffect, useRef, useState } from "react";
import appMessageService from "services/common-services/app-message-service";
import { AppUser } from "models/AppUser";
import { leaveGroupRequestRepository } from "repositories/leave-group-request-repository";
import { CARPOOLING_GROUP_NORMAL_ROUTE } from "config/route-consts";
import { handleErrorNoti } from "views/AddressView/AddressHook";

export default function useLeaveGroupRequestNormalDetail(
  model: AppUser,
  handleClose?: () => void
) {
  const [currentModel, setCurrentModel] = useState(null);

  const firstLoad = useRef(true);

  useEffect(() => {
    if (firstLoad) {
      setCurrentModel(model);
      firstLoad.current = false;
    }
  }, [model]);

  const { notifyUpdateItemSuccess } = appMessageService.useCRUDMessage();

  const handleChangeDayOfRequest = useCallback(
    () => (value: any) => {
      const newModel = { ...currentModel };
      const formatDate = new Date(value);
      const year = formatDate.getFullYear();
      const month = formatDate.getMonth() + 1;
      const day = formatDate.getDate();
      const newDate = `${year}-${month < 10 ? `0${month}` : month}-${
        day < 10 ? `0${day}` : day
      }`;
      newModel["date"] = newDate;
      setCurrentModel(newModel);
    },
    [currentModel]
  );

  const handleSave = useCallback(() => {
    leaveGroupRequestRepository.save(currentModel).subscribe(
      (res) => {
        notifyUpdateItemSuccess();
        handleClose();
      },
      (error) => {
        window.location.href = CARPOOLING_GROUP_NORMAL_ROUTE;
        handleErrorNoti(error);
      }
    );
  }, [currentModel, handleClose, notifyUpdateItemSuccess]);

  return {
    currentModel,
    handleChangeDayOfRequest,
    handleSave,
  };
}

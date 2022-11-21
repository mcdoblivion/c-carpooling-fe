import { useCallback, useEffect, useRef, useState } from "react";
import appMessageService from "services/common-services/app-message-service";
import { notification } from "antd";
import { AppUser } from "models/AppUser";
import { leaveGroupRequestRepository } from "repositories/leave-group-request-repository";
import { CARPOOLING_GROUP_NORMAL_ROUTE } from "config/route-consts";

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
        if (error.response && error.response.status === 400)
          notification.error({
            placement: "bottomRight",
            message: "Cập nhật có lỗi",
            description:
              error.response?.data?.message &&
              error.response?.data?.message?.length > 0 &&
              error.response?.data?.message.map((mess: string) => {
                return <>{mess}</>;
              }),
          });
      }
    );
  }, [currentModel, handleClose, notifyUpdateItemSuccess]);

  return {
    currentModel,
    handleChangeDayOfRequest,
    handleSave,
  };
}

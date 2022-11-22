import { useCallback, useState } from "react";
import appMessageService from "services/common-services/app-message-service";
import { notification } from "antd";
import { AppUser } from "models/AppUser";
import { carpoolingGroupRepository } from "repositories/carpooling-group-repository";

export default function useCarpoolingGroupCreate(
  model: AppUser,
  handleLoadList?: (filterParam?: any) => void,
  handleClose?: () => void
) {
  const [currentModel, setCurrentModel] = useState(new AppUser());
  const { notifyUpdateItemSuccess } = appMessageService.useCRUDMessage();

  const handleChangeTime = useCallback(
    (field) => (value: any, stringTime: string) => {
      setCurrentModel({
        ...currentModel,
        [`${field}`]: stringTime,
        [`${field}Value`]: value,
      });
    },
    [currentModel]
  );
  const handleChangeSingleField = useCallback(
    (field) => (value: any) => {
      setCurrentModel({
        ...currentModel,
        [`${field}`]:
          field === "delayDurationInMinutes" ? Number(value) : value,
      });
    },
    [currentModel]
  );

  const handleSave = useCallback(() => {
    carpoolingGroupRepository.create(currentModel).subscribe(
      (res) => {
        notifyUpdateItemSuccess();
        handleClose();
        handleLoadList();
      },
      (error) => {
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
  }, [currentModel, handleClose, handleLoadList, notifyUpdateItemSuccess]);

  return {
    currentModel,
    handleChangeTime,
    handleChangeSingleField,
    handleSave,
  };
}

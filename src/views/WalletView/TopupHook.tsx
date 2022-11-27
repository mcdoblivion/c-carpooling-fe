import { useCallback, useEffect, useRef, useState } from "react";
import appMessageService from "services/common-services/app-message-service";
import { AppUser } from "models/AppUser";
import { handleErrorNoti } from "views/AddressView/AddressHook";
import { walletRepository } from "repositories/wallets-repository";
import { userRepository } from "repositories/user-repository";

export default function useTopup(
  model: AppUser,
  handleClose?: () => void,
  handleLoadList?: (id: number) => void,
  setUser?: (value: any) => void
) {
  const [currentModel, setCurrentModel] = useState(null);
  const token = JSON.parse(localStorage.getItem("token"));

  const firstLoad = useRef(true);
  useEffect(() => {
    if (firstLoad) {
      setCurrentModel(model);
      firstLoad.current = false;
    }
  }, [model]);

  const { notifyUpdateItemSuccess } = appMessageService.useCRUDMessage();

  const handleChangeSingleField = useCallback(
    (field) => (value: any) => {
      setCurrentModel({
        ...currentModel,
        [`${field}`]: value,
      });
    },
    [currentModel]
  );

  const handleSave = useCallback(() => {
    walletRepository.topUp(currentModel.id, currentModel).subscribe(
      (res) => {
        notifyUpdateItemSuccess();
        handleClose();
        userRepository.getMe(token).subscribe((res) => {
          localStorage.setItem("currentUserInfo", JSON.stringify(res.data));
          setUser(res?.data);
          handleLoadList(res?.data?.id);
        });
        handleLoadList(currentModel.id);
      },
      (error) => {
        handleErrorNoti(error);
      }
    );
  }, [
    currentModel,
    handleClose,
    handleLoadList,
    notifyUpdateItemSuccess,
    setUser,
    token,
  ]);

  return {
    currentModel,
    handleChangeSingleField,
    handleSave,
  };
}

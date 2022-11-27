import { useCallback, useEffect, useRef, useState } from "react";
import appMessageService from "services/common-services/app-message-service";
import { AppUser } from "models/AppUser";
import { handleErrorNoti } from "views/AddressView/AddressHook";
import { walletRepository } from "repositories/wallets-repository";

export default function useWalletDetail(
  model: AppUser,
  handleClose?: () => void,
  handleLoadList?: (id: number) => void
) {
  const [currentModel, setCurrentModel] = useState(null);
  const [focused, setFocused] = useState<any>("");

  const firstLoad = useRef(true);
  useEffect(() => {
    if (firstLoad) {
      setCurrentModel(model);
      firstLoad.current = false;
    }
  }, [model]);

  const { notifyUpdateItemSuccess } = appMessageService.useCRUDMessage();

  const formatExpirationDate = useCallback((value) => {
    const clearValue = value.replace("/", "");
    if (clearValue?.length >= 3) {
      return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`;
    }
    return clearValue;
  }, []);

  const handleChangeSingleField = useCallback(
    (field) => (value: any) => {
      setFocused(field);
      switch (field) {
        case "cardNumber":
          setCurrentModel({
            ...currentModel,
            [`${field}`]: String(value),
          });
          break;

        default:
          setCurrentModel({
            ...currentModel,
            [`${field}`]: value,
          });
      }
    },
    [currentModel]
  );

  const handleChangeDateField = useCallback(
    (field) => (value: any) => {
      const formatedExpiry = formatExpirationDate(value);
      const clearValue = formatedExpiry.replace("/", "");
      const expiredMonth = Number(clearValue.slice(0, 2));
      const expiredYear = Number(clearValue.slice(2, 4));
      setFocused(field);
      setCurrentModel({
        ...currentModel,
        [`${field}`]: formatedExpiry,
        expiredMonth: expiredMonth,
        expiredYear: expiredYear,
      });
    },
    [currentModel, formatExpirationDate]
  );

  const handleSave = useCallback(() => {
    walletRepository.createCard(currentModel.id, currentModel).subscribe(
      (res) => {
        notifyUpdateItemSuccess();
        handleClose();
        handleLoadList(currentModel.id);
      },
      (error) => {
        handleErrorNoti(error);
      }
    );
  }, [currentModel, handleClose, handleLoadList, notifyUpdateItemSuccess]);

  return {
    focused,
    currentModel,
    handleChangeSingleField,
    handleChangeDateField,
    handleSave,
  };
}

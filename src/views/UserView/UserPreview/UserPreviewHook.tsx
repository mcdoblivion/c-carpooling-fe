import { notification } from "antd";
import { UploadChangeParam } from "antd/lib/upload";
import { AppUser } from "models/AppUser";
import { Moment } from "moment";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useHistory } from "react-router";
import { userRepository } from "repositories/user-repository";
import { finalize, Observable } from "rxjs";
import appMessageService from "services/common-services/app-message-service";
import { webService } from "services/common-services/web-service";
import { handleErrorNoti } from "views/AddressView/AddressHook";
export default function useUserPreview() {
  const firstLoad = useRef(true);
  const [subscription] = webService.useSubscription();
  const [model, setModel] = useState(new AppUser());
  const [loading, setLoading] = useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const history = useHistory();
  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    if (firstLoad) {
      setLoading(true);
      subscription.add(
        userRepository
          .getMe(token)
          .pipe(finalize(() => setLoading(false)))
          .subscribe((res) => {
            setModel(res?.data);
            setIsCreatingProfile(!res?.data?.userProfile);
          })
      );
      firstLoad.current = false;
    }
  }, [subscription, token]);

  useEffect(() => {
    document.title = "Hồ sơ cá nhân";
  }, []);

  const { notifyUpdateItemSuccess } = appMessageService.useCRUDMessage();

  const enumGender = useMemo(() => {
    return [
      {
        name: "Nữ",
        id: 1,
      },
      {
        name: "Nam",
        id: 2,
      },
    ];
  }, []);

  const genderObservable = useMemo(() => {
    return new Observable<any>((observer) => {
      setTimeout(() => {
        observer.next(enumGender);
      }, 500);
    });
  }, [enumGender]);

  const singleListGender = useCallback(() => {
    return genderObservable;
  }, [genderObservable]);

  const enum2FAMethod = useMemo(() => {
    return [
      { id: 1, name: "OFF", value: "OFF" },
      { id: 2, name: "Email", value: "EMAIL" },
      { id: 3, name: "SMS", value: "SMS" },
    ];
  }, []);

  const FAMethodObservable = useMemo(() => {
    return new Observable<any>((observer) => {
      setTimeout(() => {
        observer.next(enum2FAMethod);
      }, 500);
    });
  }, [enum2FAMethod]);

  const singleList2FAMethod = useCallback(() => {
    return FAMethodObservable;
  }, [FAMethodObservable]);

  const handleChangeUserProfile = useCallback(
    (fieldName: string) => (value: any) => {
      const userProfile = { ...model?.userProfile };

      switch (fieldName) {
        case "username":
          setModel({ ...model, username: value });
          break;

        case "phoneNumber":
          setModel({ ...model, phoneNumber: value });
          break;

        case "2FAMethod":
          setModel({
            ...model,
            "2FAMethod": enum2FAMethod.find(({ id }) => id === value)?.value,
          });
          break;

        case "dateOfBirth":
          userProfile["dateOfBirth"] = (value as Moment).format("YYYY-MM-DD");
          break;

        case "gender":
          userProfile["gender"] = enumGender.find(
            ({ id }) => id === value
          )?.name;
          break;

        default:
          userProfile[fieldName] = value;
      }

      setModel((previousModel) => ({ ...previousModel, userProfile }));
    },
    [enum2FAMethod, enumGender, model]
  );

  const handleChangeAvatar = useCallback(
    (info: UploadChangeParam) => {
      if (info.file.status === "done") {
        const fileUrl = info.file.response?.data?.fileUrl;

        const userProfile = { ...model?.userProfile, avatarURL: fileUrl };

        setModel({ ...model, userProfile });
      } else if (info.file.status === "error") {
        notification.error({
          placement: "bottomRight",
          message: "Có lỗi xảy ra khi tải lên ảnh!",
        });
      }
    },
    [model]
  );

  const goToHomePage = useCallback(() => {
    history.replace("/");
  }, [history]);

  const handleSuccess = useCallback(
    (res) => {
      setModel(res?.data);
      notifyUpdateItemSuccess();

      isCreatingProfile && (window.location.href = "/"); // go to home page after created profile
    },
    [isCreatingProfile, notifyUpdateItemSuccess]
  );

  const handleError = useCallback((error) => {
    if (error.response && error.response.status === 400) handleErrorNoti(error);
  }, []);

  const handleSave = useCallback(() => {
    const userObservable = isCreatingProfile
      ? userRepository.create(model)
      : userRepository.update(model);

    userObservable.subscribe(handleSuccess, handleError);
  }, [handleError, handleSuccess, isCreatingProfile, model]);

  return {
    loading,
    model,
    goToHomePage,
    handleChangeAvatar,
    handleChangeUserProfile,
    singleListGender,
    singleList2FAMethod,
    handleSave,
  };
}

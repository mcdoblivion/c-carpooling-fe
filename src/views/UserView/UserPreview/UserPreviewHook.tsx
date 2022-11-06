/* eslint-disable @typescript-eslint/no-unused-vars */
import { AxiosError } from "axios";
import { AppUser } from "models/AppUser";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useHistory } from "react-router";
import { userRepository } from "repositories/user-repository";
import { finalize, Observable } from "rxjs";
import appMessageService from "services/common-services/app-message-service";
import { webService } from "services/common-services/web-service";
import {
  detailService,
  ModelActionEnum,
} from "services/page-services/detail-service";
import { fieldService } from "services/page-services/field-service";
import { queryStringService } from "services/page-services/query-string-service";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { USER_ROUTE } from "config/route-consts";
import { notification } from "antd";
export default function useUserPreview() {
  const firstLoad = useRef(true);
  const [subscription] = webService.useSubscription();
  const [model, setModel] = useState(new AppUser());
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
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
            setImageUrl(res?.data?.userProfile?.avatarURL);
          })
      );
      firstLoad.current = false;
    }
  }, [subscription, token]);

  const { notifyUpdateItemSuccess, notifyUpdateItemError } =
    appMessageService.useCRUDMessage();

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
      }, 3000);
    });
  }, [enumGender]);

  const singleListGender = useCallback(() => {
    return genderObservable;
  }, [genderObservable]);

  const handleChangeUserProfile = useCallback(
    (fieldName: string) => (value: any) => {
      const userProfile = { ...model?.userProfile };
      if (fieldName === "phoneNumber") {
        setModel({ ...model, phoneNumber: value });
      } else if (fieldName === "dateOfBirth") {
        const formatDate = new Date(value);
        const year = formatDate.getFullYear();
        const month = formatDate.getMonth() + 1;
        const day = formatDate.getDate();
        const newDate = `${year}-${month < 10 ? `0${month}` : month}-${
          day < 10 ? `0${day}` : day
        }`;
        userProfile["dateOfBirth"] = newDate;
        setModel({ ...model, userProfile: userProfile });
      } else if (fieldName === "gender") {
        if (value === 1) {
          userProfile[fieldName] = "Female";
        } else userProfile[fieldName] = "Male";
        setModel({ ...model, userProfile: userProfile });
      } else {
        userProfile[fieldName] = value;
        setModel({ ...model, userProfile: userProfile });
      }
    },
    [model]
  );

  const getBase64 = useCallback(
    (img: RcFile, callback: (url: string) => void) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => callback(reader.result as string));
      reader.readAsDataURL(img);
    },
    []
  );

  const handleChangeAvatar = useCallback(
    (info: any) => {
      const userProfile = { ...model?.userProfile };

      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false);
        setImageUrl(url);
        userProfile["avatarURL"] = url;
        setModel({ ...model, userProfile: userProfile });
      });
    },
    [getBase64, model]
  );

  const handleGoMaster = useCallback(() => {
    history.replace(USER_ROUTE);
  }, [history]);

  const handleSave = useCallback(() => {
    userRepository.update(model).subscribe(
      (res) => {
        setModel(res?.data);
        notifyUpdateItemSuccess();
        handleGoMaster(); // go master
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
  }, [handleGoMaster, model, notifyUpdateItemSuccess]);

  return {
    loading,
    model,
    imageUrl,
    enumGender,
    handleChangeAvatar,
    handleChangeUserProfile,
    singleListGender,
    handleSave,
  };
}

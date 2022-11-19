import { AppUser } from "models/AppUser";
import { useCallback, useEffect, useRef, useState } from "react";
import { userRepository } from "repositories/user-repository";
import { finalize } from "rxjs";
import appMessageService from "services/common-services/app-message-service";
import { webService } from "services/common-services/web-service";
import { notification } from "antd";
import { driverRepository } from "repositories/driver-repository";
export default function useRegisterDriver() {
  const firstLoad = useRef(true);
  const [subscription] = webService.useSubscription();
  const [model, setModel] = useState(new AppUser());
  const [loading, setLoading] = useState(false);
  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    if (firstLoad) {
      setLoading(true);
      subscription.add(
        userRepository
          .getMe(token)
          .pipe(finalize(() => setLoading(false)))
          .subscribe((res) => {
            setModel(res?.data?.driver);
          })
      );
      firstLoad.current = false;
    }
  }, [subscription, token]);

  const { notifyUpdateItemSuccess } = appMessageService.useCRUDMessage();

  const handleChangeDriverLicenseNumber = useCallback(
    () => (value: any) => {
      setModel({ ...model, driverLicenseNumber: value });
    },
    [model]
  );

  const handleChangeFrontPhoto = useCallback(
    (info: any) => {
      const file = info && info?.file && info.file.originFileObj;
      if (info)
        driverRepository.uploadImage(file).subscribe((res: any) =>
          setModel({
            ...model,
            driverLicenseFrontPhotoURL: res[0]?.data?.fileUrl,
          })
        );
    },
    [model]
  );

  const handleChangeBackPhoto = useCallback(
    (info: any) => {
      const file = info && info?.file && info.file.originFileObj;
      if (info)
        driverRepository.uploadImage(file).subscribe((res: any) =>
          setModel({
            ...model,
            driverLicenseBackPhotoURL: res[0]?.data?.fileUrl,
          })
        );
    },
    [model]
  );

  const handleSave = useCallback(() => {
    driverRepository.create(model).subscribe(
      (res) => {
        setModel(res?.data);
        notifyUpdateItemSuccess();
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
  }, [model, notifyUpdateItemSuccess]);

  return {
    loading,
    model,
    handleChangeDriverLicenseNumber,
    handleChangeFrontPhoto,
    handleChangeBackPhoto,
    handleSave,
  };
}

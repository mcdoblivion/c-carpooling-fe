import { AppUser } from "models/AppUser";
import { useCallback, useEffect, useRef, useState } from "react";
import { userRepository } from "repositories/user-repository";
import { finalize } from "rxjs";
import appMessageService from "services/common-services/app-message-service";
import { webService } from "services/common-services/web-service";
import { notification } from "antd";
import { driverRepository } from "repositories/driver-repository";
import { UploadChangeParam } from "antd/lib/upload";
import { handleErrorNoti } from "views/AddressView/AddressHook";
import { REGISTER_DRIVER_ROUTE } from "config/route-consts";
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

  useEffect(() => {
    document.title = "Đăng ký trở thành tài xế";
  }, []);

  const { notifyUpdateItemSuccess } = appMessageService.useCRUDMessage();

  const handleChangeDriverLicenseNumber = useCallback(
    () => (value: any) => {
      setModel({ ...model, driverLicenseNumber: value });
    },
    [model]
  );

  const handleChangePhoto = useCallback(
    (
      info: UploadChangeParam,
      photoField: "driverLicenseFrontPhotoURL" | "driverLicenseBackPhotoURL"
    ) => {
      if (info.file.status === "done") {
        const fileUrl = info.file.response?.data?.fileUrl;

        setModel({
          ...model,
          [photoField]: fileUrl,
        });
      } else if (info.file.status === "error") {
        notification.error({
          placement: "bottomRight",
          message: "Có lỗi xảy ra khi tải lên ảnh!",
        });
      }
    },
    [model]
  );

  const handleChangeFrontPhoto = (info: UploadChangeParam) => {
    handleChangePhoto(info, "driverLicenseFrontPhotoURL");
  };

  const handleChangeBackPhoto = (info: UploadChangeParam) => {
    handleChangePhoto(info, "driverLicenseBackPhotoURL");
  };

  const handleSave = useCallback(() => {
    driverRepository.create(model).subscribe(
      (res) => {
        setModel(res?.data);
        userRepository
          .getMe(token)
          .pipe(finalize(() => setLoading(false)))
          .subscribe((me) => {
            notifyUpdateItemSuccess();
            localStorage.setItem("currentUserInfo", JSON.stringify(me.data));
            window.location.href = REGISTER_DRIVER_ROUTE;
          });
      },
      (error) => {
        handleErrorNoti(error);
      }
    );
  }, [model, notifyUpdateItemSuccess, token]);

  return {
    loading,
    model,
    handleChangeDriverLicenseNumber,
    handleChangeFrontPhoto,
    handleChangeBackPhoto,
    handleSave,
  };
}

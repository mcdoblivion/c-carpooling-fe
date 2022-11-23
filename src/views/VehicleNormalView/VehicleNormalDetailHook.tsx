import { notification } from "antd";
import { UploadChangeParam } from "antd/lib/upload";
import { VEHICLES_NORMAL_ROUTE } from "config/route-consts";
import { AppUser } from "models/AppUser";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useHistory } from "react-router";
import { driverRepository } from "repositories/driver-repository";
import { userRepository } from "repositories/user-repository";
import { finalize, Observable } from "rxjs";
import appMessageService from "services/common-services/app-message-service";
import { webService } from "services/common-services/web-service";
import { queryStringService } from "services/page-services/query-string-service";
import { handleErrorNoti } from "views/AddressView/AddressHook";

export default function useVehicleNormalDetail() {
  const [subscription] = webService.useSubscription();
  const [model, setModel] = useState(new AppUser());
  const firstLoad = useRef(true);

  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const token = JSON.parse(localStorage.getItem("token"));
  const { id }: any = queryStringService.useGetQueryString("id");
  const isDetail = useMemo(() => id !== null, [id]);

  useEffect(() => {
    if (firstLoad) {
      setLoading(true);
      subscription.add(
        userRepository
          .getMe(token)
          .pipe(finalize(() => setLoading(false)))
          .subscribe((res) => {
            if (isDetail) {
              const listVehicle = res?.data?.driver?.vehicles || [];
              const currentVehicle = listVehicle.filter(
                (item: AppUser) => item.id === Number(id)
              )[0];
              setModel(currentVehicle);
            } else
              setModel({ ...new AppUser(), driverId: res?.data?.driver?.id });
          })
      );
      firstLoad.current = false;
    }
  }, [id, isDetail, subscription, token]);

  const { notifyUpdateItemSuccess } = appMessageService.useCRUDMessage();
  const handleChangeFuelType = useCallback(
    (value, object) => {
      setModel({ ...model, fuelType: object?.name, fuelTypeValue: object });
    },
    [model]
  );
  const fuelTypeObservable = new Observable<any[]>((observer) => {
    setTimeout(() => {
      observer.next([
        { id: 1, name: "Gasoline", code: "1" },
        { id: 2, name: "Diesel", code: "2" },
      ]);
    }, 1000);
  });
  const fuelTypeSearchFunc = (TModelFilter?: any) => {
    return fuelTypeObservable;
  };

  const handleChangeSingleField = useCallback(
    (fieldName: string) => (value: any) => {
      setModel({
        ...model,
        [`${fieldName}`]:
          fieldName === "numberOfSeats" ||
          fieldName === "fuelConsumptionPer100kms"
            ? Number(value)
            : value,
      });
    },
    [model]
  );

  const handleChangeAvatar = useCallback(
    (fieldName) => (info: UploadChangeParam) => {
      if (info.file.status === "done") {
        const fileUrl = info.file.response?.data?.fileUrl;
        setModel({ ...model, [`${fieldName}`]: fileUrl });
      } else if (info.file.status === "error") {
        notification.error({
          placement: "bottomRight",
          message: "Có lỗi xảy ra khi tải lên ảnh!",
        });
      }
    },
    [model]
  );

  const goToVehicleMenu = useCallback(() => {
    history.push(VEHICLES_NORMAL_ROUTE);
  }, [history]);

  const handleSave = useCallback(() => {
    driverRepository.saveVehicle(model?.driverId, model?.id, model).subscribe(
      (res) => {
        notifyUpdateItemSuccess();
        goToVehicleMenu();
      },
      (error) => {
        if (error.response && error.response.status === 400)
          handleErrorNoti(error);
      }
    );
  }, [goToVehicleMenu, model, notifyUpdateItemSuccess]);

  return {
    loading,
    model,
    handleChangeSingleField,
    handleSave,
    handleChangeAvatar,
    goToVehicleMenu,
    fuelTypeSearchFunc,
    handleChangeFuelType,
  };
}

import { useCallback, useEffect, useRef, useState } from "react";
import { userRepository } from "repositories/user-repository";
import { finalize } from "rxjs";
import appMessageService from "services/common-services/app-message-service";
import { webService } from "services/common-services/web-service";
import { ADDRESS_ROUTE } from "config/route-consts";
import { notification } from "antd";

export const handleErrorNoti = (error: any) => {
  return notification.error({
    placement: "bottomRight",
    message: "Cập nhật có lỗi",
    description:
      typeof error.response?.data?.message === "string"
        ? error.response?.data?.message
        : error.response?.data?.message &&
          error.response?.data?.message?.length > 0 &&
          error.response?.data?.message.map((mess: string) => {
            return <>{mess}</>;
          }),
  });
};

export default function useAddress() {
  const firstLoad = useRef(true);
  const [subscription] = webService.useSubscription();
  const [model, setModel] = useState([]);
  const [appUserId, setAppUserId] = useState<number>(0);
  const [homeAddressId, setHomeAddressId] = useState<number>(0);
  const [workAddressId, setWorkAddressId] = useState<number>(0);

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
            setAppUserId(res?.data?.id);
            if (res?.data?.addresses?.length > 0) {
              setHomeAddressId(res?.data?.addresses[0]?.id);
              setWorkAddressId(res?.data?.addresses[1]?.id);
            }
            setModel(res?.data?.addresses);
          })
      );
      firstLoad.current = false;
    }
  }, [subscription, token]);

  useEffect(() => {
    document.title = "Địa chỉ";
  }, []);

  const { notifyUpdateItemSuccess } = appMessageService.useCRUDMessage();
  const handleChangeHomeAddress = useCallback(
    (selectedPlace: any) => {
      const newModel = [...model];

      const newAddress = {
        fullAddress: selectedPlace?.title,
        longitude: String(selectedPlace?.position[1]),
        latitude: String(selectedPlace?.position[0]),
        type: "Home",
      };
      newModel[0] = newAddress;
      setModel(newModel);
    },
    [model]
  );

  const handleChangeWorkAddress = useCallback(
    (selectedPlace: any) => {
      const newModel = [...model];
      const newAddress = {
        fullAddress: selectedPlace?.title,
        longitude: String(selectedPlace?.position[1]),
        latitude: String(selectedPlace?.position[0]),
        type: "Work",
      };
      newModel[1] = newAddress;
      setModel(newModel);
    },
    [model]
  );

  const handleGoMaster = useCallback(() => {
    window.location.href = ADDRESS_ROUTE;
  }, []);

  const handleSave = useCallback(() => {
    if (!homeAddressId && !workAddressId) {
      userRepository.createAddress(appUserId, model[0]).subscribe(
        (res) => {
          userRepository.createAddress(appUserId, model[1]).subscribe(
            (res) => {
              notifyUpdateItemSuccess();
              handleGoMaster(); // go master
            },
            (error) => {
              handleErrorNoti(error);
            }
          );
        },
        (error) => {
          handleErrorNoti(error);
        }
      );
    } else {
      userRepository
        .updateAddress(appUserId, homeAddressId, model[0])
        .subscribe(
          (res) => {
            userRepository
              .updateAddress(appUserId, workAddressId, model[1])
              .subscribe(
                (res) => {
                  notifyUpdateItemSuccess();
                  handleGoMaster(); // go master
                },
                (error) => {
                  handleErrorNoti(error);
                }
              );
          },
          (error) => {
            handleErrorNoti(error);
          }
        );
    }
  }, [
    appUserId,
    handleGoMaster,
    homeAddressId,
    model,
    notifyUpdateItemSuccess,
    workAddressId,
  ]);

  return {
    loading,
    model,
    handleChangeHomeAddress,
    handleChangeWorkAddress,
    handleSave,
  };
}

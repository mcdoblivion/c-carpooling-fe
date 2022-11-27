import { VEHICLES_NORMAL_DETAIL_ROUTE } from "config/route-consts";
import { AppUser } from "models/AppUser";
import {
  Reducer,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { useHistory } from "react-router";
import { driverRepository } from "repositories/driver-repository";
import { userRepository } from "repositories/user-repository";
import { finalize } from "rxjs";
import appMessageService from "services/common-services/app-message-service";
import { webService } from "services/common-services/web-service";
import {
  ListAction,
  ListActionType,
  listReducer,
  ListState,
} from "services/page-services/list-service";
const { notifyUpdateItemSuccess } = appMessageService.useCRUDMessage();

export default function useVehicleNormalMaster() {
  const token = JSON.parse(localStorage.getItem("token"));
  const firstLoad = useRef(true);
  const history = useHistory();
  const [{ list, count }, dispatch] = useReducer<
    Reducer<ListState<AppUser>, ListAction<AppUser>>
  >(listReducer, { list: [], count: 0 });

  const [loadingList, setLoadingList] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(false);
  const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
  const [user, setUser] = useState(new AppUser());

  const [currentItem, setCurrentItem] = useState<any>(null);

  const [subscription] = webService.useSubscription();

  const handleLoadList = useCallback(
    (user) => {
      subscription.add(
        driverRepository
          .getVehicle(user?.driver?.id)
          .pipe(finalize(() => setLoadingList(false)))
          .subscribe(
            (res) => {
              let listVehicles = [];
              if (res.data.length > 0) {
                listVehicles = res.data.map(
                  (vehicle: { id: number; licensePlate: string }) => {
                    if (vehicle.id === user.driver.vehicleIdForCarpooling) {
                      return {
                        ...vehicle,
                        licensePlate: `${vehicle.licensePlate} (Phương tiện đi chung)`,
                      };
                    }

                    return vehicle;
                  }
                );
              }

              dispatch({
                type: ListActionType.SET,
                payload: {
                  list: listVehicles,
                  count: 0,
                },
              });
            },
            (err) => {
              dispatch({
                type: ListActionType.SET,
                payload: {
                  list: [],
                  count: 0,
                },
              });
            }
          )
      );
    },
    [subscription]
  );

  useEffect(() => {
    if (firstLoad) {
      userRepository.getMe(token).subscribe((res) => {
        handleLoadList(res?.data);
        setUser(res?.data);
      });
      firstLoad.current = false;
    }
  }, [handleLoadList, token]);

  useEffect(() => {
    document.title = "Phương tiện";
  }, []);

  const handleSetMainVehicle = useCallback(
    (vehicleId) => {
      setLoadingList(true);
      driverRepository
        .mainVehicle(user?.driver?.id, vehicleId)
        .pipe(finalize(() => setLoadingList(false)))
        .subscribe((res) => {
          notifyUpdateItemSuccess();
          handleLoadList(user);
        });
    },
    [handleLoadList, user]
  );

  const handleGoPreview = useCallback((model: AppUser) => {
    setCurrentItem(model);
    setVisible(true);
  }, []);

  const handleClosePreview = useCallback(() => {
    setVisible(false);
  }, []);
  const handleCloseDetail = useCallback(() => {
    setVisibleDetail(false);
  }, []);

  const handleDelete = useCallback(
    (vehicleId: number) => {
      driverRepository
        .deleteVehicle(user?.driver?.id, vehicleId)
        .subscribe((res) => handleLoadList(user));
    },
    [handleLoadList, user]
  );

  const handleGoCreate = useCallback(() => {
    history.push(VEHICLES_NORMAL_DETAIL_ROUTE);
  }, [history]);

  const handleGoDetail = useCallback(
    (id: any) => {
      history.push(`${VEHICLES_NORMAL_DETAIL_ROUTE}?id=${id}`);
    },
    [history]
  );
  return {
    list,
    count,
    loadingList,
    visible,
    visibleDetail,
    currentItem,
    handleDelete,
    handleGoPreview,
    handleGoDetail,
    handleClosePreview,
    handleCloseDetail,
    handleGoCreate,
    handleSetMainVehicle,
  };
}

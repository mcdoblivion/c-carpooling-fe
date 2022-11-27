import { AppUser } from "models/AppUser";
import {
  Reducer,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { userRepository } from "repositories/user-repository";
import { walletRepository } from "repositories/wallets-repository";
import { finalize } from "rxjs";
import appMessageService from "services/common-services/app-message-service";
import { webService } from "services/common-services/web-service";
import {
  ListAction,
  ListActionType,
  listReducer,
  ListState,
} from "services/page-services/list-service";
import { handleErrorNoti } from "views/AddressView/AddressHook";

export default function useWalletMaster() {
  const token = JSON.parse(localStorage.getItem("token"));
  const firstLoad = useRef(true);
  const [{ list, count }, dispatch] = useReducer<
    Reducer<ListState<AppUser>, ListAction<AppUser>>
  >(listReducer, { list: [], count: 0 });

  const [loadingList, setLoadingList] = useState<boolean>(false);
  const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
  const [visibleTopup, setVisibleTopup] = useState<boolean>(false);

  const [user, setUser] = useState(new AppUser());
  const [currentItem, setCurrentItem] = useState<any>({
    ...new AppUser(),
    id: user?.id,
  });

  const [subscription] = webService.useSubscription();
  const { notifyUpdateItemSuccess } = appMessageService.useCRUDMessage();

  const handleLoadList = useCallback(
    (id) => {
      setLoadingList(true);

      subscription.add(
        walletRepository
          .getCards(id)
          .pipe(finalize(() => setLoadingList(false)))
          .subscribe(
            (res) => {
              dispatch({
                type: ListActionType.SET,
                payload: {
                  list: res.data,
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
        handleLoadList(res?.data?.id);
        setUser(res?.data);
      });
      firstLoad.current = false;
    }
  }, [handleLoadList, token]);

  const handleDelete = useCallback(
    (cardId: number) => {
      walletRepository.deleteCard(user?.id, cardId).subscribe(
        (res) => {
          notifyUpdateItemSuccess();
          handleLoadList(user?.id);
        },
        (error) => {
          handleErrorNoti(error);
        }
      );
    },
    [handleLoadList, notifyUpdateItemSuccess, user?.id]
  );

  useEffect(() => {
    document.title = "Ví C-Carpooling";
  }, []);

  const handleGoCreate = useCallback(() => {
    setCurrentItem({
      ...new AppUser(),
      id: user?.id,
      expiry: "MM/YY",
    });
    setVisibleDetail(true);
  }, [user?.id]);

  const handleGoTopUp = useCallback(
    (card) => {
      setCurrentItem({
        ...new AppUser(),
        id: user?.id,
        paymentMethodId: card.id,
        lastFourDigits: card.lastFourDigits,
      });
      setVisibleTopup(true);
    },
    [user?.id]
  );

  const handleCloseDetail = useCallback(() => {
    setVisibleDetail(false);
  }, []);

  const handleCloseTopup = useCallback(() => {
    setVisibleTopup(false);
  }, []);

  return {
    user,
    list,
    count,
    loadingList,
    visibleDetail,
    visibleTopup,
    currentItem,
    handleDelete,
    handleGoTopUp,
    handleCloseDetail,
    handleCloseTopup,
    handleGoCreate,
    handleLoadList,
    setUser,
  };
}

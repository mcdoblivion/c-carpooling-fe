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
import { webService } from "services/common-services/web-service";
import {
  ListAction,
  ListActionType,
  listReducer,
  ListState,
} from "services/page-services/list-service";

export default function useWalletMaster() {
  const token = JSON.parse(localStorage.getItem("token"));
  const firstLoad = useRef(true);
  const [{ list, count }, dispatch] = useReducer<
    Reducer<ListState<AppUser>, ListAction<AppUser>>
  >(listReducer, { list: [], count: 0 });

  const [loadingList, setLoadingList] = useState<boolean>(false);
  const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
  const [visiblePreview, setVisiblePreview] = useState<boolean>(false);
  const [visibleTopup, setVisibleTopup] = useState<boolean>(false);

  const [user, setUser] = useState(new AppUser());
  const [currentItem, setCurrentItem] = useState<any>({
    ...new AppUser(),
    id: user?.id,
  });

  const [subscription] = webService.useSubscription();

  const handleLoadList = useCallback(
    (id) => {
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
      walletRepository
        .deleteCard(user?.id, cardId)
        .subscribe((res) => handleLoadList(user?.id));
    },
    [handleLoadList, user?.id]
  );

  useEffect(() => {
    document.title = "Ví C-Carpooling";
  }, []);

  const handleGoCreate = useCallback(() => {
    setCurrentItem({
      ...new AppUser(),
      id: user?.id,
      expiry: "12/30",
    });
    setVisibleDetail(true);
  }, [user?.id]);

  const handleGoTopUp = useCallback(
    (cardId: number) => {
      setCurrentItem({
        ...new AppUser(),
        id: user?.id,
        paymentMethodId: cardId,
      });
      setVisibleTopup(true);
    },
    [user?.id]
  );

  const handleGoPreview = useCallback(
    (model: AppUser) => {
      setCurrentItem(model);
      setVisiblePreview(true);
      setVisibleDetail(false);
    },
    [setCurrentItem]
  );
  const handleClosePreview = useCallback(() => {
    setVisiblePreview(false);
  }, []);
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
    visiblePreview,
    visibleDetail,
    visibleTopup,
    currentItem,
    handleDelete,
    handleGoPreview,
    handleGoTopUp,
    handleClosePreview,
    handleCloseDetail,
    handleCloseTopup,
    handleGoCreate,
    handleLoadList,
    setUser,
  };
}

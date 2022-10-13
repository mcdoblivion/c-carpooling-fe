import React, { useCallback, useState } from "react";
import { useHistory } from "react-router";
import { Subscription } from "rxjs";

export const webService = {
  useSubscription() {
    const subscription = React.useRef(new Subscription()).current;
    React.useEffect(
      function () {
        return function cleanup() {
          subscription.unsubscribe();
        };
      },
      [subscription]
    );
    return [subscription];
  },

  useModal(onOpenModal?: () => void, onCloseModal?: () => void) {
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

    const handleOpenModal = useCallback(() => {
      if (!isOpenModal) {
        setIsOpenModal(true);
        if (typeof onOpenModal === "function") onOpenModal();
      }
    }, [isOpenModal, onOpenModal]);

    const handleCloseModal = useCallback(() => {
      if (isOpenModal) {
        setIsOpenModal(false);
        if (typeof onCloseModal === "function") onCloseModal();
      }
    }, [isOpenModal, onCloseModal]);

    return {
      isOpenModal,
      handleOpenModal,
      handleCloseModal,
    };
  },

  usePage(routePrefix: string) {
    const history = useHistory();

    const baseRoute = React.useMemo(() => {
      let listPath = routePrefix.split("/");
      const baseRoute = "/" + listPath[listPath.length - 1];
      return baseRoute;
    }, [routePrefix]);

    const handleGoBase = React.useCallback(() => {
      history.replace(`${routePrefix}${baseRoute}-master`);
    }, [routePrefix, baseRoute, history]);

    const handleGoDetail = React.useCallback(() => {
      history.push(`${routePrefix}${baseRoute}-detail`);
    }, [routePrefix, baseRoute, history]);

    const handleGoDetailWithId = React.useCallback(
      (id: any) => {
        return () => {
          history.push(`${routePrefix}${baseRoute}-detail?id=${id}`);
        };
      },
      [routePrefix, baseRoute, history]
    );

    const handleGoPreview = React.useCallback(
      (id: any) => {
        return () => {
          history.push(`${routePrefix}${baseRoute}-preview?id=${id}`);
        };
      },
      [routePrefix, baseRoute, history]
    );

    const handleGoApproval = React.useCallback(
      (id: any) => {
        return () => {
          history.push(`${routePrefix}${baseRoute}-approve?id=${id}`);
        };
      },
      [routePrefix, baseRoute, history]
    );

    return {
      handleGoBase,
      handleGoDetail,
      handleGoDetailWithId,
      handleGoPreview,
      handleGoApproval,
    };
  },
};

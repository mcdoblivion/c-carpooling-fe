/* eslint-disable @typescript-eslint/no-unused-vars */
import { AxiosError } from "axios";
import { AppUser } from "models/AppUser";
import { useCallback, useEffect, useRef } from "react";
import { useHistory } from "react-router";
import { userRepository } from "repositories/user-repository";
import { finalize } from "rxjs";
import appMessageService from "services/common-services/app-message-service";
import { webService } from "services/common-services/web-service";
import {
  detailService,
  ModelActionEnum,
} from "services/page-services/detail-service";
import { fieldService } from "services/page-services/field-service";
import { queryStringService } from "services/page-services/query-string-service";

export default function useUserDetail() {
  const firstLoad = useRef(true);
  const [subscription] = webService.useSubscription();
  const history = useHistory();
  const { id }: any = queryStringService.useGetQueryString("id");
  // use hook
  const { model, dispatch } = detailService.useModel<AppUser>(AppUser);

  useEffect(() => {
    if (firstLoad) {
      subscription.add(
        userRepository.getMe().subscribe((res) => {
          dispatch({ type: ModelActionEnum.SET, payload: res });
        })
      );
      firstLoad.current = false;
    }
  }, [dispatch, id, subscription]);

  const { notifyUpdateItemSuccess, notifyUpdateItemError } =
    appMessageService.useCRUDMessage();

  const {
    handleChangeDateField,
    handleChangeAllField,
    handleChangeSingleField,
    handleChangeTreeField,
    handleChangeSelectField,
  } = fieldService.useField(model, dispatch);

  // const {
  //     handleGoMaster,
  //     loading,
  //     setLoading,
  // } = detailService.useActionsDetail<GoodsIssueRequest>(
  //     model,
  //     goodsIssueRequestRepository.save,
  //     handleChangeAllField,
  //     GOODS_ISSUE_REQUEST_ROUTE
  // );

  // const handleGoPreview = useCallback(
  //     (modelId: number) => {
  //         history.replace(
  //             `${GOODS_ISSUE_REQUEST_PREVIEW_ROUTE}?id=${modelId}&&tabKey=2`
  //         );
  //     },
  //     [history]
  // );

  // const handleSaveModel = useCallback(() => {
  //     setLoading(true);
  //     const newModel = model;
  //     var filtered = newModel.goodsIssueRequestAttachments || [];
  //     filtered = filtered.filter(function (value: any, index: any, arr: any) {
  //         return value.url || value.file || value.name;
  //     });
  //     newModel.goodsIssueRequestAttachments = filtered;

  //     subscription.add(
  //         goodsIssueRequestRepository
  //             .save(newModel)
  //             .pipe(finalize(() => setLoading(false)))
  //             .subscribe({
  //                 next: (item: GoodsIssueRequest) => {
  //                     handleChangeAllField(item); // setModel
  //                     notifyUpdateItemSuccess();
  //                     if (item?.id) handleGoPreview(item?.id);
  //                     else handleGoMaster(); // go master
  //                 },
  //                 error: (error: AxiosError<GoodsIssueRequest>) => {
  //                     if (error.response && error.response.status === 400)
  //                         handleChangeAllField(error.response?.data);
  //                     notifyUpdateItemError();
  //                 },
  //             })
  //     );
  // }, [
  //     handleChangeAllField,
  //     handleGoMaster,
  //     handleGoPreview,
  //     model,
  //     notifyUpdateItemError,
  //     notifyUpdateItemSuccess,
  //     setLoading,
  //     subscription,
  // ]);
  return {
    model,
  };
}

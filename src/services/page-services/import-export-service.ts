import { useRef, useCallback, ChangeEvent } from "react";
import { Model, ModelFilter } from "react3l-common";
import { RefObject } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { Observable } from "rxjs";
import { saveAs } from "file-saver";
import { Modal } from "antd";
import { useTranslation } from "react-i18next";
import { webService } from "../common-services/web-service";
import { generalLanguageKeys } from "config/language-keys";
import React from "react";

export const importExportService = {
  /**
   *
   * react hook for handle action import file
   * @param: dispatch
   * @param: onImportSuccess?: (list?: T[]) => void,
   * @return: { ref, handleClick, handleImportList, handleImportContentList }
   *
   * */

  useImport<T extends Model>(onImportSuccess?: (list?: T[]) => void) {
    const [subscription] = webService.useSubscription(); // subscription avoid leak memory
    const [translate] = useTranslation();

    const ref: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null); // ref object to clear value of input after import

    /** handle action when import get error **/
    const handleImportError = useCallback(
      (error: AxiosError<any>) => {
        Modal.error({
          title: translate(generalLanguageKeys.toasts.error),
          content: error.response.data,
          className: "ant-modal-import-error",
        });
      },
      [translate]
    );

    /** handle import list from server **/
    const handleImportList = useCallback(
      (onImport: (file: File) => Observable<void>) => {
        return (event: ChangeEvent<HTMLInputElement>) => {
          if (event.target.files.length > 0) {
            const file: File = event.target.files[0];
            if (typeof onImport === "function") {
              subscription.add(
                onImport(file).subscribe({
                  next: (_res: any) => {
                    Modal.success({
                      content: translate(generalLanguageKeys.toasts.success),
                    });
                    if (typeof onImportSuccess === "function") {
                      onImportSuccess();
                    }
                  }, // onSuccess
                  error: (err: any) => handleImportError(err),
                })
              );
            }
          }
        };
      },
      [subscription, handleImportError, onImportSuccess, translate]
    );

    /** handle import content list from server **/
    const handleImportContentList = useCallback(
      (
        modelId: number,
        onImport: (file: File, priceListId: number) => Observable<T[]>
      ) => {
        return (event: ChangeEvent<HTMLInputElement>) => {
          const file: File = event.target.files[0];
          if (typeof onImport === "function") {
            subscription.add(
              onImport(file, modelId).subscribe({
                next: (list: T[]) => {
                  Modal.success({
                    content: translate(generalLanguageKeys.toasts.success),
                  });
                  if (typeof onImportSuccess === "function") {
                    onImportSuccess(list);
                  }
                },
                error: handleImportError, // onError
              })
            );
          }
        };
      },
      [handleImportError, onImportSuccess, subscription, translate]
    );

    const handleClick = useCallback(() => {
      ref.current.value = null;
    }, []);

    return { ref, handleClick, handleImportList, handleImportContentList };
  },

  /**
   *
   * react hook for handle action import file
   * @return: { handleListExport,
      handleExportTemplateList,
      handleContentExport,
      handleContentExportTemplate }
   *
   * */
  useExport() {
    const [subscription] = webService.useSubscription();
    const [loading, setLoading] = React.useState<boolean>(false);

    /** handle action when export succesfully **/
    const handleExportSuccess = (response: AxiosResponse<any>) => {
      const fileName = response.headers["content-disposition"]
        .split(";")
        .find((n: any) => n.includes("filename="))
        .replace("filename=", "")
        .trim(); // define fileName for saver
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: "application/octet-stream",
        })
      ); // defince urlObject
      setLoading(false);
      saveAs(url, fileName); // save file
    };

    /** handle export list from server **/
    const handleListExport = useCallback(
      <TFilter extends ModelFilter>(
        filter: TFilter,
        onExport: (filter: ModelFilter) => Observable<AxiosResponse<any>>
      ) => {
        return () => {
          if (typeof onExport === "function") {
            setLoading(true);
            subscription.add(
              onExport(filter).subscribe(
                handleExportSuccess // onSuccess
              )
            );
          }
        };
      },
      [subscription]
    );

    /** handle export template from server **/
    const handleExportTemplateList = useCallback(
      (onExport: () => Observable<AxiosResponse<any>>) => {
        return () => {
          if (typeof onExport === "function") {
            subscription.add(
              onExport().subscribe(
                handleExportSuccess // onSuccess
              )
            );
          }
        };
      },
      [subscription]
    );

    /** handleExport contentList from server  **/
    const handleContentExport = useCallback(
      <T extends Model>(
        model: T,
        onExport: (model: T) => Observable<AxiosResponse<any>>
      ) => {
        return () => {
          if (typeof onExport === "function") {
            subscription.add(
              onExport(model).subscribe(
                handleExportSuccess // onSuccess
              )
            );
          }
        };
      },
      [subscription]
    );

    /** handleExport listContent template from server **/
    const handleContentExportTemplate = useCallback(
      <T extends Model>(
        model: T,
        onExport: (id: number) => Observable<AxiosResponse<any>>
      ) => {
        return () => {
          if (typeof onExport === "function") {
            subscription.add(
              onExport(model?.id).subscribe(
                handleExportSuccess // onSuccess
              )
            );
          }
        };
      },
      [subscription]
    );

    return {
      handleListExport,
      handleExportTemplateList,
      handleContentExport,
      handleContentExportTemplate,
      loading,
    };
  },
};

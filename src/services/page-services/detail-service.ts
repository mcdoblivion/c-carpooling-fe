import {
  Reducer,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { Model, ModelFilter } from "react3l-common";
import { finalize, forkJoin, Observable } from "rxjs";
import { webService } from "../common-services/web-service";
import { queryStringService } from "./query-string-service";
import appMessageService from "../common-services/app-message-service";
import { AxiosError } from "axios";
import { fieldService } from "./field-service";
import { useHistory } from "react-router";
import { ValidationError } from "./validation-service";
import { utilService } from "services/common-services/util-service";
import React from "react";

/* Action and Reducer of Mapping control */
type MappingModel<T extends Model> = {
  list?: T[];
  count?: number;
  contentIds?: number[];
  contentValues?: Model[];
  checkedKeys?: number[];
  checkedValues?: T[];
};

enum MappingTypeEnum {
  UPDATE_LIST,
  UPDATE_CONTENTS,
  UPDATE_CHECKED,
  CHECKED,
  CHECKED_ALL,
  UNCHECKED,
  UNCHECKED_ALL,
  UNDO_CHECKED,
}

interface MappingAction<T extends Model> {
  type: MappingTypeEnum;
  payload?: MappingModel<T>;
}

function mappingReducer<T extends Model>(
  state: MappingModel<T>,
  action: MappingAction<T>
): MappingModel<T> {
  switch (action.type) {
    case MappingTypeEnum.UPDATE_CONTENTS:
      return {
        ...state,
        contentIds: action.payload.contentIds,
        contentValues: action.payload.contentValues,
        checkedKeys: action.payload.contentIds,
      };
    case MappingTypeEnum.UPDATE_LIST:
      return {
        ...state,
        list: [...action.payload.list],
        count: action.payload.count,
      };
    case MappingTypeEnum.UPDATE_CHECKED:
      return {
        ...state,
        checkedKeys: action.payload.checkedKeys,
        checkedValues: action.payload.checkedValues,
      };
    case MappingTypeEnum.CHECKED:
      return {
        ...state,
        checkedKeys: [...state.checkedKeys, ...action.payload.checkedKeys],
        checkedValues: [
          ...state.checkedValues,
          ...action.payload.checkedValues,
        ],
      };
    case MappingTypeEnum.UNCHECKED:
      state.checkedKeys = state.checkedKeys.filter(
        (current: number) => current !== action.payload.checkedKeys[0]
      );
      state.checkedValues = state.checkedValues.filter(
        (current: T) => current.id !== action.payload.checkedValues[0]?.id
      );
      return {
        ...state,
      };
    case MappingTypeEnum.CHECKED_ALL:
      return {
        ...state,
        checkedKeys: Array.from(
          new Set([...state.checkedKeys, ...action.payload.checkedKeys])
        ),
        checkedValues: utilService.uniqueArray([
          ...state.checkedValues,
          ...action.payload.checkedValues,
        ]),
      };
    case MappingTypeEnum.UNCHECKED_ALL:
      state.checkedKeys = state.checkedKeys.filter((current: number) =>
        action.payload.checkedKeys.every((number) => number !== current)
      );
      state.checkedValues = state.checkedValues.filter((current: T) =>
        action.payload.checkedValues.every((item: T) => item.id !== current.id)
      );
      return {
        ...state,
      };
    case MappingTypeEnum.UNDO_CHECKED:
      return {
        ...state,
        checkedKeys: action.payload.checkedKeys,
        checkedValues: action.payload.checkedValues,
      };
    default:
      return { ...state };
  }
}

/* Action and Reducer of Model control */
export enum ModelActionEnum {
  SET,
  UPDATE,
  SET_ERRORS,
  UPDATE_ERRORS,
}

export interface ModelAction<T extends Model> {
  type: ModelActionEnum;
  payload: T | ValidationError;
}

function modelReducer<T extends Model>(state: T, action: ModelAction<T>): T {
  switch (action.type) {
    case ModelActionEnum.SET:
      return { ...(action.payload as T) };
    case ModelActionEnum.UPDATE:
      return { ...state, ...(action.payload as T) };
    case ModelActionEnum.SET_ERRORS: {
      let errors: ValidationError = {};
      let errorArrays: ValidationError = {};
      if (!utilService.isEmpty(action.payload)) {
        Object.keys(action.payload as ValidationError).forEach(
          (key: string) => {
            if (
              action.payload[key] &&
              typeof action.payload[key] === "string"
            ) {
              errors[key] = action.payload[key];
            } else {
              errorArrays[key] = action.payload[key];
            }
          }
        );
        if (!utilService.isEmpty(errorArrays)) {
          Object.keys(errorArrays).forEach((key: string) => {
            const contents: any[] = state[key] || [];
            const values = errorArrays[key];
            Object.keys(values).forEach((key: string) => {
              const indexNumber = Number(key);
              if (contents[indexNumber]) {
                contents[indexNumber]["errors"] = { ...values[key] };
              } else {
                contents[indexNumber] = {};
                contents[indexNumber]["errors"] = { ...values[key] };
              }
            });
          });
        }
      }
      return { ...state, errors };
    }
    case ModelActionEnum.UPDATE_ERRORS:
      if (action.payload && !utilService.isEmpty(action.payload)) {
        state["errors"] = {
          ...state["errors"],
          ...(action.payload as ValidationError),
        };
      }
      return { ...state };
    default:
      return { ...state };
  }
}

export const detailService = {
  /**
   *
   * react hook for manage state of model
   * @param: ModelClass: new () => T
   * @param: initData: T
   *
   * @return: { model, dispatch }
   *
   * */
  useModel<T extends Model>(ModelClass: new () => T, initData?: T) {
    const [model, dispatch] = useReducer<Reducer<T, ModelAction<T>>>(
      modelReducer,
      initData ? initData : new ModelClass()
    );

    return {
      model,
      dispatch,
    };
  },

  /**
   *
   * react hook for check detail page and set detail data
   * @param: getDetail:(id: number | string) => Observable<T>
   * @param: dispatch: React.Dispatch<ModelAction<T>>
   *
   * @return: { isDetail }
   *
   * */
  useGetIsDetail<T extends Model>(
    getDetail: (id: number | string) => Observable<T>,
    dispatch: React.Dispatch<ModelAction<T>>
  ) {
    const { id }: any = queryStringService.useGetQueryString("id");
    const isDetail = useMemo(() => id !== null, [id]);
    const [subscription] = webService.useSubscription();

    useEffect(() => {
      if (isDetail) {
        subscription.add(
          getDetail(id).subscribe({
            next: (res) =>
              dispatch({ type: ModelActionEnum.SET, payload: res }),
            error: (_err) => {},
          })
        );
      }
    }, [dispatch, getDetail, id, isDetail, subscription]);

    return { isDetail };
  },

  /**
   *
   * react hook for handle actions in detail page
   * @param: model: T
   * @param: saveModel: (t: T) => Observable<T>
   *
   * @return: { loading, setLoading, handleSaveModel, handleGoMaster }
   *
   * */
  useActionsDetail<T extends Model>(
    model: T,
    saveModel: (t: T) => Observable<T>,
    handleChangeAllField: (data: any) => void,
    routeView: string
  ) {
    const history = useHistory();

    const baseRoute = useMemo(() => {
      let listPath = routeView.split("/");
      const baseRoute = "/" + listPath[listPath.length - 1];
      return baseRoute;
    }, [routeView]);

    const [loading, setLoading] = useState<boolean>(false);
    const [subscription] = webService.useSubscription();
    const { notifyUpdateItemSuccess, notifyUpdateItemError } =
      appMessageService.useCRUDMessage();

    const handleGoMaster = useCallback(() => {
      history.replace(`${routeView}${baseRoute}-master`);
    }, [routeView, baseRoute, history]);

    const handleSaveModel = useCallback(() => {
      setLoading(true);
      subscription.add(
        saveModel(model)
          .pipe(finalize(() => setLoading(false)))
          .subscribe({
            next: (item: T) => {
              handleChangeAllField(item); // setModel
              notifyUpdateItemSuccess();
              handleGoMaster(); // go master
            },
            error: (error: AxiosError<T>) => {
              if (error.response && error.response.status === 400)
                handleChangeAllField(error.response?.data);
              notifyUpdateItemError();
            },
          })
      );
    }, [
      handleChangeAllField,
      handleGoMaster,
      model,
      notifyUpdateItemError,
      notifyUpdateItemSuccess,
      saveModel,
      subscription,
    ]);
    return { loading, setLoading, handleSaveModel, handleGoMaster };
  },

  /**
   *
   * react hook for handle logic in detail modal page
   * @param: ModelClass: new () => T
   * @param: getDetail: (id: number) => Observable<T>
   * @param: saveModel: (t: Model) => Observable<T>
   * @param: saveModel: handleSeach?: () => void
   * 
   * @return: { model,
      dispatch,
      isOpenDetailModal,
      loadingModel,
      handleOpenDetailModal,
      handleSaveModel,
      handleCloseDetailModal,
      handleChangeSingleField,
      handleChangeSelectField,
      handleChangeMultipleSelectField,
      handleChangeDateField,
      handleChangeTreeField,
      handleChangeAllField }
   *
   * */
  useDetailModal<T extends Model>(
    ModelClass: new () => T,
    getDetail: (id: number) => Observable<T>,
    saveModel: (t: Model) => Observable<T>,
    handleSeach?: () => void
  ) {
    const { notifyUpdateItemSuccess, notifyUpdateItemError } =
      appMessageService.useCRUDMessage();

    const [subscription] = webService.useSubscription();

    const [isOpenDetailModal, setIsOpenDetailModal] = useState<boolean>(false);
    const [loadingModel, setLoadingModel] = useState<boolean>(false);
    const { model, dispatch } = this.useModel(ModelClass);
    const {
      handleChangeSingleField,
      handleChangeSelectField,
      handleChangeMultipleSelectField,
      handleChangeDateField,
      handleChangeTreeField,
      handleChangeAllField,
    } = fieldService.useField(model, dispatch);

    const handleOpenDetailModal = useCallback(
      (id?: number) => {
        setIsOpenDetailModal(true);
        if (id) {
          setLoadingModel(true);
          subscription.add(
            getDetail(id)
              .pipe(finalize(() => setLoadingModel(false)))
              .subscribe((item: T) => {
                handleChangeAllField(item);
              })
          );
        } else {
          handleChangeAllField(new ModelClass());
        }
      },
      [getDetail, handleChangeAllField, subscription, ModelClass]
    );

    const handleSaveModel = useCallback(() => {
      setLoadingModel(true);
      subscription.add(
        saveModel(model)
          .pipe(finalize(() => setLoadingModel(false)))
          .subscribe({
            next: (item: T) => {
              handleChangeAllField(item);
              setIsOpenDetailModal(false);
              if (typeof handleSeach === "function") handleSeach();
              notifyUpdateItemSuccess({
                message: "Cập nhật thành công",
                className: "antd-notification-drawer",
              });
            },
            error: (error: AxiosError<T>) => {
              if (error.response && error.response.status === 400)
                handleChangeAllField(error.response?.data);
              notifyUpdateItemError({
                message: "Cập nhật thất bại",
                className: "antd-notification-drawer",
              });
            },
          })
      );
    }, [
      saveModel,
      subscription,
      handleSeach,
      notifyUpdateItemError,
      notifyUpdateItemSuccess,
      handleChangeAllField,
      model,
    ]);

    const handleCloseDetailModal = useCallback(() => {
      setIsOpenDetailModal(false);
      if (model.id) handleChangeAllField({ ...model });
      else handleChangeAllField({ ...new ModelClass() });
    }, [ModelClass, handleChangeAllField, model]);

    return {
      model,
      dispatch,
      isOpenDetailModal,
      loadingModel,
      handleOpenDetailModal,
      handleSaveModel,
      handleCloseDetailModal,
      handleChangeSingleField,
      handleChangeSelectField,
      handleChangeMultipleSelectField,
      handleChangeDateField,
      handleChangeTreeField,
      handleChangeAllField,
    };
  },

  /**
   *
   * react hook for handle logic in detail modal page
   * @param: list: (filter: TFilter) => Observable<T[]>,
   * @param: count: (filter: TFilter) => Observable<number>,
   * @param: mappingData: (data: T[]) => TContent[],
   * @param: modelFilter: ModelFilter,
   * @param: contents: TContent[],
   * @param: isMultipleMapping: boolean = false
   *
   * @return: {
   *  open,
   *  listMapping: mappingModel.list,
   *  countMapping: mappingModel.count,
   *  checkedKeys: mappingModel.checkedKeys,
   *  spinning,
   *  handleOpenMapping,
   *  handleCloseMapping,
   *  handleSaveMapping,
   *  handleCancelMapping,
   *  handleCheckItem,
   *  }
   *
   * */

  useMappingService<
    T extends Model,
    TFilter extends ModelFilter,
    TContent extends Model
  >(
    list: (filter: TFilter) => Observable<T[]>,
    count: (filter: TFilter) => Observable<number>,
    mappingData: (data: T[]) => TContent[],
    modelFilter: ModelFilter,
    contents: TContent[],
    mappingField: [string, string],
    isMultipleMapping: boolean = false
  ) {
    const [open, setOpen] = React.useState<boolean>(false);
    const [spinning, setSpinning] = React.useState<boolean>(false);
    const [mappingModel, dispatchMappingModel] = React.useReducer<
      Reducer<MappingModel<T>, MappingAction<T>>
    >(mappingReducer, {
      list: [],
      count: 0,
      checkedKeys: [],
      checkedValues: [],
    });
    const [subscription] = webService.useSubscription();
    const firstUpdate = React.useRef(true);

    const handleSaveMapping = React.useCallback(() => {
      const { checkedValues } = mappingModel;
      var contentValues = mappingData(checkedValues);
      setOpen(false);
      return contentValues;
    }, [mappingModel, mappingData]);

    const handleResetMapping = React.useCallback(() => {
      const checkedKeys =
        contents.length > 0
          ? contents.map((content) => content[mappingField[0]])
          : [];
      const checkedValues =
        contents.length > 0
          ? contents.map((content) => content[mappingField[1]])
          : [];
      dispatchMappingModel({
        type: MappingTypeEnum.UPDATE_CHECKED,
        payload: {
          checkedKeys,
          checkedValues,
        },
      });
    }, [mappingField, contents]);

    const handleCancelMapping = React.useCallback(() => {
      if (!isMultipleMapping) {
        handleResetMapping();
      }
      setOpen(false);
    }, [isMultipleMapping, handleResetMapping]);

    const handleChangeItem = React.useCallback(
      (checkedIds: number[], checkedRows: T[], info: { type: string }) => {
        if (info && info.type === "all" && checkedIds.length === 0) {
          const { checkedKeys, checkedValues } = mappingModel;
          dispatchMappingModel({
            type: MappingTypeEnum.UPDATE_CHECKED,
            payload: {
              checkedKeys: [...checkedKeys],
              checkedValues: [...checkedValues],
            },
          });
        } else {
          dispatchMappingModel({
            type: MappingTypeEnum.UPDATE_CHECKED,
            payload: {
              checkedKeys: [...checkedIds],
              checkedValues: [...checkedRows],
            },
          });
        }
      },
      [mappingModel]
    );

    const handleCheck = React.useCallback((record: T, selected: boolean) => {
      const { id } = record;
      if (selected) {
        dispatchMappingModel({
          type: MappingTypeEnum.CHECKED,
          payload: {
            checkedKeys: [id],
            checkedValues: [record],
          },
        });
      } else {
        dispatchMappingModel({
          type: MappingTypeEnum.UNCHECKED,
          payload: {
            checkedKeys: [id],
            checkedValues: [record],
          },
        });
      }
    }, []);

    const handleCheckAll = React.useCallback(
      (selected: boolean, selectedRows: T[], changeRows: T[]) => {
        const selectedIds = changeRows.map((row) => row.id);
        if (selected) {
          dispatchMappingModel({
            type: MappingTypeEnum.CHECKED_ALL,
            payload: {
              checkedKeys: [...selectedIds],
              checkedValues: [...changeRows],
            },
          });
        } else {
          dispatchMappingModel({
            type: MappingTypeEnum.UNCHECKED_ALL,
            payload: {
              checkedKeys: [...selectedIds],
              checkedValues: [...changeRows],
            },
          });
        }
      },
      []
    );

    const handleGetListMapping = React.useCallback(
      (filterParam?: TFilter) => {
        setSpinning(true);
        const filterValue = filterParam
          ? { ...filterParam }
          : ({ ...new ModelFilter(), skip: 0, take: 10 } as TFilter);
        const getMappingData = forkJoin([list(filterValue), count(filterValue)])
          .pipe(
            finalize(() => {
              setSpinning(false);
            })
          )
          .subscribe({
            next: (results: [T[], number]) => {
              const list = results[0];
              const count = Number(results[1]);
              dispatchMappingModel({
                type: MappingTypeEnum.UPDATE_LIST,
                payload: {
                  list,
                  count,
                },
              });
            },
            error: () => {},
          });
        subscription.add(getMappingData);
      },
      [count, list, subscription]
    );

    const handleOpenMapping = React.useCallback(() => {
      setOpen(true);
      if (mappingModel.list.length === 0) {
        handleGetListMapping();
      }
      if (isMultipleMapping) {
        dispatchMappingModel({
          type: MappingTypeEnum.UPDATE_CHECKED,
          payload: {
            checkedKeys: [],
            checkedValues: [],
          },
        });
      }
    }, [handleGetListMapping, isMultipleMapping, mappingModel.list]);

    const handleCloseMapping = React.useCallback(() => {
      setOpen(false);
    }, []);

    React.useEffect(() => {
      if (contents && !isMultipleMapping) {
        handleResetMapping();
      }
    }, [contents, isMultipleMapping, handleResetMapping]);

    React.useEffect(() => {
      if (firstUpdate.current) {
        firstUpdate.current = false;
        return;
      }
      if (modelFilter) {
        handleGetListMapping(modelFilter as TFilter);
      }
    }, [handleGetListMapping, modelFilter]);

    return {
      open,
      listMapping: mappingModel.list,
      countMapping: mappingModel.count,
      checkedKeys: mappingModel.checkedKeys,
      spinning,
      handleOpenMapping,
      handleCloseMapping,
      handleSaveMapping,
      handleCancelMapping,
      handleChangeItem,
      handleCheck,
      handleCheckAll,
    };
  },
};

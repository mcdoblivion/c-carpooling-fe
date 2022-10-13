import { Moment } from "moment";
import { Model, ModelFilter } from "react3l-common";
import React, { Dispatch, SetStateAction, useMemo, useReducer } from "react";
import {
  GuidFilter,
  StringFilter,
  NumberFilter,
  DateFilter,
  IdFilter,
} from "react3l-advanced-filters";
import { Observable } from "rxjs";
import memoize from "fast-memoize";

export enum FilterActionEnum {
  SET,
  UPDATE,
  UPDATE_PAGINATION,
}

export interface FilterAction<TFilter> {
  type: FilterActionEnum;
  payload?: TFilter;
}

export function filterReducer<TFilter extends ModelFilter>(
  state: TFilter,
  action: FilterAction<TFilter>
) {
  switch (action.type) {
    case FilterActionEnum.SET:
      return {
        ...action.payload,
      };
    case FilterActionEnum.UPDATE:
      return {
        ...state,
        ...action.payload,
      };
    case FilterActionEnum.UPDATE_PAGINATION:
      return {
        ...state,
        skip: action.payload?.skip,
        take: action.payload?.take,
      };
  }
}

export const filterService = {
  /**
   *
   * react hook for manage state of model filter
   * @param: ModelFilterClass: new () => T
   * @param: initData?: T
   *
   * @return: { modelFilter, dispatchFilter }
   *
   * */
  useModelFilter<T extends ModelFilter>(
    ModelFilterClass: new () => T,
    initData?: T
  ) {
    const [modelFilter, dispatchFilter] = useReducer(
      filterReducer,
      initData ? initData : new ModelFilterClass()
    );

    return {
      modelFilter,
      dispatchFilter,
    };
  },

  /**
   *
   * react hook for handle actions to change filter field
   * @param: modelFilter: TFilter
   * @param: (action: FilterAction<TFilter>) => void
   *
   * @return: { value,
      handleChangeInputFilter,
      handleChangeSelectFilter,
      handleChangeMultipleSelectFilter,
      handleChangeDateFilter,
      handleChangeDateMasterFilter,
      handleChangeAllFilter,
      handleChangeSingleTreeFilter, }
   *
   * */
  useFilter<TFilter extends ModelFilter>(
    modelFilter: TFilter,
    dispatch: (action: FilterAction<TFilter>) => void
  ) {
    const value = useMemo(() => modelFilter, [modelFilter]);

    /** Handler for changing a Input Filter component
     */
    const handleChangeInputFilter = React.useMemo(
      () =>
        memoize(
          (config: {
              fieldName: string;
              fieldType: string;
              classFilter: new (partial?: any) => StringFilter | NumberFilter;
            }) =>
            (newValue?: string | number | null) => {
              const { fieldName, fieldType, classFilter: ClassFilter } = config;
              if (typeof newValue === "string") {
                newValue = newValue.trim();
              }
              dispatch({
                type: FilterActionEnum.UPDATE,
                payload: {
                  [fieldName]: new ClassFilter({
                    [fieldType]: newValue,
                  }),
                  skip: 0,
                } as TFilter,
              });
            }
        ),
      [dispatch]
    );

    /**
      Handler specifically used for Select Filter component 
    */
    const handleChangeSelectFilter = React.useMemo(
      () =>
        memoize(
          (config: {
              fieldName: string;
              fieldType: string;
              classFilter: new (partial?: any) => IdFilter | GuidFilter;
            }) =>
            (idValue: number, value: Model) => {
              const { fieldName, fieldType, classFilter: ClassFilter } = config;
              dispatch({
                type: FilterActionEnum.UPDATE,
                payload: {
                  [`${fieldName}Value`]: value,
                  [`${fieldName}Id`]: Object.assign(new ClassFilter(), {
                    [fieldType]: idValue,
                  }),
                  skip: 0,
                } as TFilter,
              });
            }
        ),
      [dispatch]
    );

    /**
      Handler specifically used for Multiple Select Filter component 
    */
    const handleChangeMultipleSelectFilter = React.useMemo(
      () =>
        memoize(
          (config: {
              fieldName: string;
              fieldType: string;
              classFilter: new (partial?: any) => IdFilter | GuidFilter;
            }) =>
            (values: Model[]) => {
              const { fieldName, fieldType, classFilter: ClassFilter } = config;
              if (values) {
                const listIds =
                  values.length > 0 ? values.map((current) => current.id) : [];
                dispatch({
                  type: FilterActionEnum.UPDATE,
                  payload: {
                    [`${fieldName}Value`]: [...values],
                    [`${fieldName}Id`]: new ClassFilter({
                      [fieldType]: [...listIds],
                    }),
                    skip: 0,
                  } as TFilter,
                });
              }
            }
        ),
      [dispatch]
    );

    /** Handler specifically used for Numer Range Filter Component  */
    const handleChangeNumberRangeFilter = React.useMemo(
      () =>
        memoize(
          (config: {
              fieldName: string;
              classFilter: new (partial?: any) => NumberFilter;
            }) =>
            (values: [number, number]) => {
              const { fieldName, classFilter: ClassFilter } = config;
              if (values && values.length === 2) {
                dispatch({
                  type: FilterActionEnum.UPDATE,
                  payload: {
                    [fieldName]: new ClassFilter({
                      greaterEqual: values[0],
                      lessEqual: values[1],
                    }),
                    skip: 0,
                  } as TFilter,
                });
              }
            }
        ),
      [dispatch]
    );

    /**
      Handler specifically used for Date Filter component 
    */
    const handleChangeDateFilter = React.useMemo(
      () =>
        memoize(
          (config: {
              fieldName: string;
              fieldType: string | [string, string];
            }) =>
            (date: Moment | [Moment, Moment]) => {
              const { fieldName, fieldType } = config;
              if (date instanceof Array && fieldType instanceof Array) {
                dispatch({
                  type: FilterActionEnum.UPDATE,
                  payload: {
                    [fieldName]: new DateFilter({
                      [fieldType[0]]: date[0],
                      [fieldType[1]]: date[1],
                    }),
                    skip: 0,
                  } as TFilter,
                });
              } else {
                dispatch({
                  type: FilterActionEnum.UPDATE,
                  payload: {
                    [fieldName]: new DateFilter({
                      [fieldType as string]: date,
                    }),
                    skip: 0,
                  } as TFilter,
                });
              }
            }
        ),
      [dispatch]
    );

    /**
      Handler specifically used for Date Filter Master component 
    */
    const handleChangeDateMasterFilter = React.useMemo(
      () =>
        memoize(
          (config: { fieldName: string; fieldType: [string, string] }) =>
            (item: any, dates: any) => {
              const { fieldName, fieldType } = config;
              dispatch({
                type: FilterActionEnum.UPDATE,
                payload: {
                  [`${fieldName}Selected`]: { ...item },
                  [fieldName]:
                    dates && dates.length > 0
                      ? new DateFilter({
                          [fieldType[0]]: dates[0],
                          [fieldType[1]]: dates[1],
                        })
                      : undefined,
                  skip: 0,
                } as TFilter,
              });
            }
        ),
      [dispatch]
    );

    /**
      Handler specifically used for Tree filter component 
    */
    const handleChangeSingleTreeFilter = React.useMemo(
      () =>
        memoize(
          (config: {
              fieldName: string;
              fieldType: string;
              classFilter: new (partial?: any) => IdFilter | GuidFilter;
            }) =>
            (values?: Model[]) => {
              const { fieldName, fieldType, classFilter: ClassFilter } = config;
              if (values) {
                const id =
                  values.length > 0
                    ? values.map((current) => current.id)
                    : undefined;
                dispatch({
                  type: FilterActionEnum.UPDATE,
                  payload: {
                    [`${fieldName}Value`]: values?.length > 0 && values[0],
                    [`${fieldName}Id`]: new ClassFilter({
                      [fieldType]: id,
                    }),
                    skip: 0,
                  } as TFilter,
                });
              }
            }
        ),
      [dispatch]
    );

    /** Handler to change input search value */
    const handleChangeInputSearch = React.useCallback(
      (value: string) => {
        dispatch({
          type: FilterActionEnum.UPDATE,
          payload: {
            search: value,
            skip: 0,
          } as any,
        });
      },
      [dispatch]
    );

    /**
      Handler to overwrite the whole filter
    */
    const handleChangeAllFilter = React.useCallback(
      (data: any) => {
        dispatch({
          type: FilterActionEnum.SET,
          payload: data,
        });
      },
      [dispatch]
    );

    return {
      value,
      handleChangeInputFilter,
      handleChangeSelectFilter,
      handleChangeMultipleSelectFilter,
      handleChangeDateFilter,
      handleChangeDateMasterFilter,
      handleChangeAllFilter,
      handleChangeSingleTreeFilter,
      handleChangeNumberRangeFilter,
      handleChangeInputSearch,
    };
  },

  /**
   *
   * react hook for get a enum list
   * @param: handleList: () => Observable<T[]>
   *
   * @return:  [list, setList]
   * */
  useEnumList<T extends Model>(
    handleList: () => Observable<T[]>
  ): [T[], Dispatch<SetStateAction<T[]>>] {
    const [list, setList] = React.useState<T[]>([]);

    React.useEffect(() => {
      handleList().subscribe((list: T[]) => {
        setList(list);
      });
    }, [handleList]);

    return [list, setList];
  },
};

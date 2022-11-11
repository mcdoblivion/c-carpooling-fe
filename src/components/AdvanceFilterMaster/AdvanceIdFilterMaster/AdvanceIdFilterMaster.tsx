import ChevronDown16 from "@carbon/icons-react/es/chevron--down/16";
import Checkmark16 from "@carbon/icons-react/es/checkmark/16";
import Search16 from "@carbon/icons-react/es/search/16";
import { useDebounceFn } from "ahooks";
import { Empty, Tooltip } from "antd";
import classNames from "classnames";
import React, { RefObject } from "react";
import { Model, ModelFilter } from "react3l-common";
import { ErrorObserver, Subscription } from "rxjs";
import "./AdvanceIdFilterMaster.scss";
import { DEBOUNCE_TIME_300 } from "config/consts";
import { InputText } from "react3l-ui-library";
import { utilService } from "services/common-services/util-service";

export interface AdvanceIdFilterMasterProps<
  T extends Model,
  TModelFilter extends ModelFilter
> {
  value?: number | string;

  label?: string;

  valueFilter?: TModelFilter;

  searchProperty?: string;

  searchType?: string;

  placeHolder?: string;

  disabled?: boolean;

  isMaterial?: boolean;

  isEnumList?: boolean;

  isIdValue?: boolean;

  typeRender?: string;

  getList?: any;

  onChange?: (T: number, value?: T) => void;

  render?: (t: T) => string;

  classFilter: new () => TModelFilter;

  className?: string;

  preferOptions?: T[];

  maxLength?: number;

  maxLengthItem?: number;
}

function AdvanceIdFilterMaster(
  props: AdvanceIdFilterMasterProps<Model, ModelFilter>
) {
  const {
    valueFilter,
    label,
    value,
    searchProperty,
    searchType,
    placeHolder,
    disabled,
    isMaterial,
    isEnumList,
    isIdValue,
    typeRender,
    getList,
    onChange,
    render,
    classFilter: ClassFilter,
    className,
    preferOptions,
    maxLength,
    maxLengthItem = 30,
  } = props;

  const [internalValue, setInternalValue] = React.useState<Model>();

  const [loading, setLoading] = React.useState<boolean>(false);

  const [list, setList] = React.useState<Model[]>([]);

  const [isExpand, setExpand] = React.useState<boolean>(false);

  const wrapperRef: RefObject<HTMLDivElement> =
    React.useRef<HTMLDivElement>(null);

  const inputRef: any = React.useRef<any>(null);

  const selectListRef: RefObject<HTMLDivElement> =
    React.useRef<HTMLDivElement>(null);

  const handleGetList = React.useCallback(
    async (filterValue: ModelFilter) => {
      setLoading(true);
      getList(filterValue).subscribe({
        next: (res: any) => {
          const data = res?.data?.records ? res?.data?.records : res?.data;
          setList(data);
          setLoading(false);
        },
        error: (err: ErrorObserver<Error>) => {
          setList([]);
          setLoading(false);
        },
      });
    },
    [getList]
  );

  const { run } = useDebounceFn(
    (searchTerm: string) => {
      const cloneValueFilter = valueFilter
        ? JSON.parse(JSON.stringify(valueFilter))
        : new ClassFilter();
      if (!isEnumList) {
        if (searchType) {
          cloneValueFilter[searchProperty][searchType] = searchTerm;
        } else cloneValueFilter[searchProperty] = searchTerm;
      }
      handleGetList(cloneValueFilter);
    },
    {
      wait: DEBOUNCE_TIME_300,
    }
  );

  const handleLoadList = React.useCallback(() => {
    try {
      const filter = valueFilter ? { ...valueFilter } : new ClassFilter();
      handleGetList(filter);
      // eslint-disable-next-line no-empty
    } catch (error) {}
  }, [valueFilter, ClassFilter, handleGetList]);

  const handleToggle = React.useCallback(
    async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!disabled) {
        setExpand(true);
        setTimeout(() => {
          inputRef.current.children[0].focus();
        }, 300);
        await handleLoadList();
      }
    },
    [handleLoadList, disabled]
  );

  const handleCloseAdvanceIdFilterMaster = React.useCallback(() => {
    setExpand(false);
  }, []);

  const handleClickItem = React.useCallback(
    (item: Model) => (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setInternalValue(item);
      onChange(item.id, item);
      handleCloseAdvanceIdFilterMaster();
    },
    [handleCloseAdvanceIdFilterMaster, setInternalValue, onChange]
  );

  const handleSearchChange = React.useCallback(
    (searchTerm: string) => {
      run(searchTerm);
    },
    [run]
  );

  const handleMove = React.useCallback(
    (item) => (event: any) => {
      switch (event.keyCode) {
        case 13:
          handleClickItem(item)(null);
          break;
        case 40:
          if (event.target.nextElementSibling !== null) {
            event.target.nextElementSibling.focus();
          }
          event.preventDefault();
          break;
        case 38:
          if (event.target.previousElementSibling !== null) {
            event.target.previousElementSibling.focus();
          }
          event.preventDefault();
          break;
      }
      return;
    },
    [handleClickItem]
  );

  React.useEffect(() => {
    const subscription = new Subscription();
    if (value !== null && value !== undefined) {
      const filterValue = new ClassFilter();
      if (isIdValue) {
        const listFilterPreferOptions = preferOptions?.filter(
          (current) => current.id === Number(value)
        );
        if (listFilterPreferOptions && listFilterPreferOptions?.length > 0) {
          setInternalValue(listFilterPreferOptions[0]);
        } else {
          filterValue["id"]["equal"] = Number(value);
          subscription.add(getList);
          getList(filterValue).subscribe((res: Model[]) => {
            if (res) {
              const filterList = res.filter(
                (current) => current.id === Number(value)
              );
              if (filterList && filterList?.length > 0) {
                setInternalValue(filterList[0]);
              }
            }
          });
        }
      } else {
        setInternalValue({
          [typeRender]: value,
        });
      }
    } else {
      setInternalValue(null);
    }
    return function cleanup() {
      subscription.unsubscribe();
    };
  }, [value, getList, ClassFilter, isIdValue, typeRender, preferOptions]);

  utilService.useClickOutside(wrapperRef, handleCloseAdvanceIdFilterMaster);

  return (
    <>
      <div
        className={classNames("advance-id-filter-master__wrapper", className)}
        ref={wrapperRef}
      >
        <div
          className={classNames(
            "advance-id-filter-master__container p-l--sm p-t--xs p-r--xs p-b--xs",
            {
              "filter-bg": isExpand,
              "p-b---active": value,
            }
          )}
          onClick={handleToggle}
        >
          <div
            className={classNames({
              "filter-active":
                typeof value === "number" || typeof value === "string",
            })}
          >
            <div className="advance-id-filter-master__title">
              <span className="filter-title"> {label}</span>
              <ChevronDown16 />
            </div>
          </div>
        </div>
        {isExpand && (
          <div className="advance-id-filter-master__list-container m-t--xxxs">
            <div className="advance-id-filter__input p--xs">
              <InputText
                isSmall={false}
                maxLength={maxLength}
                onChange={handleSearchChange}
                placeHolder={placeHolder}
                suffix={<Search16 />}
                isMaterial={isMaterial}
                ref={inputRef}
              />
            </div>
            {!loading ? (
              <div className="advance-id-master__list" ref={selectListRef}>
                {list.length > 0 ? (
                  list.map((item, index) => (
                    <div
                      className={classNames("advance-id-filter__item p--xs")}
                      tabIndex={-1}
                      key={index}
                      onKeyDown={handleMove(item)}
                      onClick={handleClickItem(item)}
                    >
                      {maxLengthItem && render(item)?.length > maxLengthItem ? (
                        <Tooltip title={render(item)}>{render(item)}</Tooltip>
                      ) : (
                        render(item)
                      )}
                      {item.id === internalValue?.id && <Checkmark16 />}
                    </div>
                  ))
                ) : (
                  <Empty />
                )}
              </div>
            ) : (
              <div className="advance-id-filter__loading"></div>
            )}
            {!loading && list.length > 0 && (
              <div className="advance-id-master__list-prefer">
                {list &&
                  list?.length > 0 &&
                  list.map((item, index) => (
                    <div
                      className={classNames(
                        "advance-id-filter__prefer-option advance-id-filter__item p--xs"
                      )}
                      key={index}
                      onKeyDown={handleMove(item)}
                      onClick={handleClickItem(item)}
                    >
                      <span className="advance-id-master__text">
                        {maxLengthItem &&
                        render(item)?.length > maxLengthItem ? (
                          <Tooltip title={render(item)}>{render(item)}</Tooltip>
                        ) : (
                          render(item)
                        )}
                      </span>
                      {item.id === internalValue?.id && <Checkmark16 />}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

AdvanceIdFilterMaster.defaultProps = {
  searchProperty: "name",
  searchType: "contain",
  isEnumList: false,
  isMaterial: false,
  disabled: false,
  typeRender: "name",
  isIdValue: true,
  maxLength: 200,
};

export default AdvanceIdFilterMaster;

/* eslint-disable no-case-declarations */
/* eslint-disable no-empty */
import Add16 from "@carbon/icons-react/es/add/16";
import Checkmark16 from "@carbon/icons-react/es/checkmark/16";
import { Model, ModelFilter } from "react3l-common";
import { useDebounceFn } from "ahooks";
import { Empty, Tooltip } from "antd";
import classNames from "classnames";
import React, { RefObject } from "react";
import type { ErrorObserver } from "rxjs";
import "./Select.scss";
import { BORDER_TYPE } from "react3l-ui-library/build/config/enum";
import { DEBOUNCE_TIME_300 } from "config/consts";
import { InputSelect, IconLoading } from "react3l-ui-library";
import { utilService } from "services/common-services/util-service";
import { webService } from "services/common-services/web-service";

export interface SelectProps<
  T extends Model,
  TModelFilter extends ModelFilter
> {
  value?: Model;

  valueFilter?: TModelFilter;

  searchProperty?: string;

  searchType?: string;

  placeHolder?: string;

  disabled?: boolean;

  isMaterial?: boolean;

  isEnumerable?: boolean;

  appendToBody?: boolean;

  isRequired?: boolean;

  getList?: any;

  onChange?: (id: number, T?: T) => void;

  render?: (t: T) => string;

  classFilter: new () => TModelFilter;

  type?: BORDER_TYPE;

  label?: string;

  selectWithAdd?: boolean;

  selectWithPreferOption?: boolean;

  isSmall?: boolean;

  preferOptions?: T[];

  maxLengthItem?: number;
}

function defaultRenderObject<T extends Model>(t: T) {
  return t?.name;
}

function Select(props: SelectProps<Model, ModelFilter>) {
  const {
    value,
    valueFilter,
    searchProperty,
    searchType,
    placeHolder,
    disabled,
    isEnumerable,
    appendToBody,
    isRequired,
    getList,
    onChange,
    render,
    classFilter: ClassFilter,
    type,
    label,
    selectWithAdd,
    isSmall,
    preferOptions,
    maxLengthItem,
  } = props;

  const internalValue = React.useMemo((): Model => {
    return value || null;
  }, [value]);

  const [loading, setLoading] = React.useState<boolean>(false);

  const [list, setList] = React.useState<Model[]>([]);

  const [isExpand, setExpand] = React.useState<boolean>(false);

  const wrapperRef: RefObject<HTMLDivElement> =
    React.useRef<HTMLDivElement>(null);

  const selectListRef: RefObject<HTMLDivElement> =
    React.useRef<HTMLDivElement>(null);

  const [appendToBodyStyle, setAppendToBodyStyle] = React.useState({});

  const [subscription] = webService.useSubscription();

  const handleGetList = React.useCallback(
    (valueFilter: ModelFilter) => {
      setLoading(true);
      subscription.add(getList);
      if (isEnumerable) {
        getList(valueFilter).subscribe({
          next: (res: any) => {
            setList(res);
            setLoading(false);
          },
          error: (err: ErrorObserver<Error>) => {
            setList([]);
            setLoading(false);
          },
        });
      } else {
        getList(valueFilter).subscribe({
          next: (res: any) => {
            setList(res?.data?.records);
            setLoading(false);
          },
          error: (err: ErrorObserver<Error>) => {
            setList([]);
            setLoading(false);
          },
        });
      }
    },
    [getList, isEnumerable, subscription]
  );

  const handleLoadList = React.useCallback(() => {
    try {
      setLoading(true);
      subscription.add(getList);
      const filter = valueFilter ? valueFilter : new ClassFilter();
      handleGetList(filter);
    } catch (error) {}
  }, [subscription, getList, valueFilter, ClassFilter, handleGetList]);

  const { run } = useDebounceFn(
    (searchTerm: string) => {
      const cloneValueFilter = valueFilter
        ? JSON.parse(JSON.stringify(valueFilter))
        : new ClassFilter();
      if (!isEnumerable) {
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

  const handleClearInput = React.useCallback(() => {
    handleLoadList();
  }, [handleLoadList]);

  const handleToggle = React.useCallback(
    async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!disabled) {
        setExpand(true);
        if (isEnumerable) {
          if (list.length === 0) {
            await handleLoadList();
          }
        } else {
          await handleLoadList();
        }
      }
    },
    [handleLoadList, isEnumerable, list, disabled]
  );

  const handleCloseSelect = React.useCallback(() => {
    setExpand(false);
  }, []);

  const handleClickItem = React.useCallback(
    (item: Model) => (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      onChange(item.id, item);
      handleCloseSelect();
    },
    [handleCloseSelect, onChange]
  );

  const handleSearchChange = React.useCallback(
    (searchTerm: string) => {
      run(searchTerm);
    },
    [run]
  );

  const handleClearItem = React.useCallback(() => {
    onChange(undefined);
  }, [onChange]);

  const handleKeyPress = React.useCallback(
    (event: any) => {
      switch (event.keyCode) {
        case 40:
          const firstItem = selectListRef.current
            .firstElementChild as HTMLElement;
          firstItem.focus();
          break;
        case 9:
          handleCloseSelect();
          break;
        default:
          return;
      }
    },
    [handleCloseSelect]
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

  const handleKeyEnter = React.useCallback(
    (event: any) => {
      if (event.key === "Enter") {
        handleToggle(null);
      }
      return;
    },
    [handleToggle]
  );

  utilService.useClickOutside(wrapperRef, handleCloseSelect);

  React.useEffect(() => {
    if (isExpand && appendToBody) {
      const currentPosition = wrapperRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - currentPosition.bottom;
      if (spaceBelow <= 200) {
        setTimeout(() => {
          setAppendToBodyStyle({
            position: "fixed",
            bottom: spaceBelow + wrapperRef.current.clientHeight,
            left: currentPosition.left,
            maxWidth: wrapperRef.current.clientWidth,
          });
        }, 100);
      } else {
        setAppendToBodyStyle({
          position: "fixed",
          top: currentPosition.top + wrapperRef.current.clientHeight,
          left: currentPosition.left,
          maxWidth: wrapperRef.current.clientWidth,
        });
      }
    }
  }, [appendToBody, isExpand]);

  return (
    <>
      <div className="select__container" ref={wrapperRef}>
        <div className="select__input" onClick={handleToggle}>
          <InputSelect
            value={internalValue} // value of input, event should change these on update
            render={render}
            placeHolder={placeHolder}
            expanded={isExpand}
            disabled={disabled}
            onSearch={handleSearchChange}
            onClear={handleClearItem}
            onKeyDown={handleKeyPress}
            onKeyEnter={handleKeyEnter}
            handleClearInput={handleClearInput}
            isRequired={isRequired}
            type={type}
            label={label}
            isSmall={isSmall}
          />
        </div>
        {isExpand && (
          <div className="select__list-container" style={appendToBodyStyle}>
            {!loading ? (
              <>
                <div className="select__list" ref={selectListRef}>
                  {list.length > 0 ? (
                    list.map((item, index) => (
                      <div
                        className={classNames("select__item p-l--xs p-y--xs", {
                          "select__item--selected":
                            item.id === internalValue?.id,
                        })}
                        tabIndex={-1}
                        key={index}
                        onKeyDown={handleMove(item)}
                        onClick={handleClickItem(item)}
                      >
                        {maxLengthItem &&
                        render(item)?.length > maxLengthItem ? (
                          <Tooltip title={render(item)}>
                            <span className="select__text">
                              {utilService.limitWord(
                                render(item),
                                maxLengthItem
                              )}
                            </span>
                          </Tooltip>
                        ) : (
                          <span className="select__text">{render(item)}</span>
                        )}
                        {item.id === internalValue?.id && <Checkmark16 />}
                      </div>
                    ))
                  ) : (
                    <Empty />
                  )}
                </div>
              </>
            ) : (
              <div className="select__loading">
                <IconLoading color="#0F62FE" size={24} />
              </div>
            )}
            {!loading && list.length > 0 && (
              <div className="select__list-prefer">
                {preferOptions &&
                  preferOptions?.length > 0 &&
                  preferOptions.map((item, index) => (
                    <div
                      className={classNames(
                        "select__prefer-option select__item p--xs",
                        {
                          "select__item--selected":
                            item.id === internalValue?.id,
                        }
                      )}
                      key={index}
                      onKeyDown={handleMove(item)}
                      onClick={handleClickItem(item)}
                    >
                      {maxLengthItem && render(item)?.length > maxLengthItem ? (
                        <Tooltip title={render(item)}>
                          <span className="select__text">
                            {utilService.limitWord(render(item), maxLengthItem)}
                          </span>
                        </Tooltip>
                      ) : (
                        <span className="select__text">{render(item)}</span>
                      )}
                      {item.id === internalValue?.id && <Checkmark16 />}
                    </div>
                  ))}
              </div>
            )}
            {selectWithAdd && (
              <div
                className={classNames(
                  "select__bottom-button select__add-button p-y--xs"
                )}
              >
                <Add16 className="m-l--xxs" />
                <span>Add new</span>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

Select.defaultProps = {
  searchProperty: "name",
  searchType: "contain",
  isEnumerable: false,
  appendToBody: false,
  render: defaultRenderObject,
  isMaterial: false,
  disabled: false,
  maxLengthItem: 30,
};

export default Select;

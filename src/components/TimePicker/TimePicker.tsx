import {
  TimePicker as TimePickerAntd,
  TimePickerProps as AntdTimePickerProps,
} from "antd";
import classNames from "classnames";
import { Moment } from "moment";
import React, { ReactSVGElement, RefObject } from "react";
import CloseFilled16 from "@carbon/icons-react/es/close--filled/16";
import "./TimePicker.scss";
import { BORDER_TYPE } from "react3l-ui-library/build/config/enum";

interface TimePickerAction {
  name?: string;
  action?: any;
}
interface TimePickerProps {
  value?: Moment | any;
  label?: string;
  isMaterial?: boolean;
  dateFormat?: string[];
  error?: string;
  onChange?: (value: Moment | null, dateString?: string) => void;
  type?: BORDER_TYPE;
  isSmall?: boolean;
  disabled?: boolean;
  isRequired?: boolean;
  className?: string;
  action?: TimePickerAction;
  placeholder?: string;
}

function TimePicker(props: TimePickerProps & AntdTimePickerProps) {
  const {
    value,
    onChange,
    className,
    type,
    label,
    isRequired,
    action,
    isSmall,
    disabled,
  } = props;

  const wrapperRef: RefObject<HTMLDivElement> =
    React.useRef<HTMLDivElement>(null);

  const handleClearDate = React.useCallback(
    (event: React.MouseEvent<ReactSVGElement, MouseEvent>) => {
      event.stopPropagation();
      onChange(null);
    },
    [onChange]
  );

  return (
    <div
      className={classNames("date-picker__wrapper", className)}
      ref={wrapperRef}
    >
      <div className="date-picker__label m-b--xxxs">
        {type !== BORDER_TYPE.FLOAT_LABEL && label && (
          <label
            className={classNames("component__title", {
              "component__title--disabled": disabled,
            })}
          >
            {label}
            {isRequired && <span className="text-danger">&nbsp;*</span>}
          </label>
        )}
        <span style={{ width: "100%" }}></span>
        {action && (
          <span
            className="m-l--xxxs body-text--md color-link"
            style={{ cursor: "pointer" }}
            onClick={action.action}
          >
            {action.name}
          </span>
        )}
      </div>
      <div className="date-picker__container">
        <TimePickerAntd
          value={value}
          {...props}
          onChange={onChange}
          format="HH:mm"
          placement={"bottomRight"}
          style={{ width: "100%" }}
          allowClear={false}
          className={classNames({
            "date-picker__wrapper--sm": isSmall,
            "p-y--xxs": isSmall,
            "p-x--xs": isSmall,
            "p--xs": !isSmall,
            "date-picker--material": type === BORDER_TYPE.MATERIAL,
            "date-picker--disabled ": disabled,
            "date-picker--float": type === BORDER_TYPE.FLOAT_LABEL,
          })}
        />
        {type === BORDER_TYPE.FLOAT_LABEL && label && (
          <label
            id="component__title-id"
            className={classNames("component__title component__title--normal", {
              "component__title--sm": isSmall,
              "component__title-up": value,
            })}
          >
            {label}
            {isRequired && <span className="text-danger">&nbsp;*</span>}
          </label>
        )}
        <span
          className={classNames(
            "date-picker__icon-wrapper",
            {
              "date-picker__icon-wrapper--material":
                type === BORDER_TYPE.MATERIAL,
            },

            { "date-picker__icon-wrapper--disabled": disabled },
            { "date-picker__icon-wrapper--sm": isSmall }
          )}
        >
          <CloseFilled16
            className={classNames("date-picker__icon-clear", "m-l--xxs")}
            onClick={handleClearDate}
          ></CloseFilled16>
        </span>
      </div>
    </div>
  );
}
TimePicker.defaultProps = {
  isMaterial: false,
  label: "",
  isSmall: false,
  type: BORDER_TYPE.BORDERED,
  isRequired: false,
  disabled: false,
  className: "",
};

export default TimePicker;

import classNames from "classnames";
import React, { RefObject } from "react";
import "./InputPassword.scss";

interface InputTextAction {
  name?: string;
  action?: any;
}
export interface InputTextProps {
  label?: string;
  isRequired?: boolean;
  floatLabel?: boolean;
  isMaterial?: boolean;
  prefix?: string | JSX.Element;
  suffix?: string | JSX.Element;
  value?: string;
  disabled?: boolean;
  placeHolder?: string;
  className?: string;
  showCount?: boolean;
  maxLength?: number;
  isSmall?: boolean;
  action?: InputTextAction;
  onChange?: (T: string | null) => void;
  onEnter?: (T: string | null) => void;
  onBlur?: (T: string | null) => void;
  onKeyDown?: (event: any) => void;
  inputType?: string;
  style?: any;
}

const InputTextLogin = React.forwardRef(
  (props: InputTextProps, ref: React.Ref<any>) => {
    const {
      action,
      suffix,
      maxLength,
      // value,
      disabled,
      placeHolder,
      className,
      isSmall,
      onChange,
      onEnter,
      onBlur,
      onKeyDown,
      label,
      isRequired,
      inputType,
      style,
    } = props;

    const [internalValue, setInternalValue] = React.useState<string>("");

    const inputRef: RefObject<HTMLInputElement> =
      React.useRef<HTMLInputElement>(null);

    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (
          !maxLength ||
          (maxLength && event.target.value.length <= maxLength)
        ) {
          setInternalValue(event.target.value);
          if (typeof onChange === "function") {
            onChange(event.target.value);
          }
        }
      },
      [onChange, maxLength]
    );

    const handleKeyPress = React.useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
          if (typeof onEnter === "function") {
            onEnter(event.currentTarget.value);
          }
        }
      },
      [onEnter]
    );

    const handleKeyDown = React.useCallback(
      (event) => {
        if (typeof onKeyDown === "function") {
          onKeyDown(event);
        }
      },
      [onKeyDown]
    );

    const handleBlur = React.useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        if (typeof onBlur === "function") {
          onBlur(event.currentTarget.value);
        }
      },
      [onBlur]
    );

    return (
      <div className={classNames("input-password__wrapper", className)}>
        <div className="input-login__label m-b--xxxs">
          {label && (
            <label
              className={classNames("component__title", {
                "component__title--disabled": disabled,
              })}
            >
              {label}
              {isRequired && <span className="text-danger">&nbsp;*</span>}
            </label>
          )}

          {action && (
            <span
              className="m-l--xxxs color-action"
              style={{ cursor: "pointer" }}
              onClick={action.action}
            >
              {action.name}
            </span>
          )}
        </div>
        <div
          className={classNames("component__input input-login__container", {
            "input-login__container--sm": isSmall,
            "p-y--xxs": isSmall,
            "p-x--xs": isSmall,
            "p--xs": !isSmall,
            "input-login--material": true,
            "input-login--disabled ": disabled,
          })}
          ref={ref}
          onClick={() => {
            inputRef.current.focus();
          }}
        >
          <input
            type={inputType}
            value={internalValue}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder={placeHolder}
            ref={inputRef}
            disabled={disabled}
            className={classNames("component__input", {
              "disabled-field": disabled,
            })}
            style={style}
          />
          {suffix && (
            <>
              {typeof suffix === "string" ? (
                <span className="body-text--md m-l--xxs">{suffix}</span>
              ) : (
                <div className="m-l--xxs input-login__icon">{suffix}</div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
);

export default InputTextLogin;

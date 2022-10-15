import {
  Loop32,
  ArrowRight16,
  Email16,
  ArrowLeft16,
} from "@carbon/icons-react";
import { Divider } from "antd";
import { FormItem } from "react3l-ui-library";
import React from "react";
import Button from "react3l-ui-library/build/components/Button";
import InputTextLogin from "./InputTextLogin/InputTextLogin";
import "./Login.scss";

export interface ForgotPasswordProps {
  onChangeEmail?: (event: any) => void;
  onSendMail?: () => void;
  showLogin?: () => void;
  errorMessageEmail?: string;
  email?: string;
  translate?: any;
}

export default function ForgotPassword({
  onChangeEmail,
  onSendMail,
  showLogin,
  errorMessageEmail,
  email,
  translate,
}: ForgotPasswordProps) {
  return (
    <div>
      <div className="login-page__content--logo">
        <div>
          <Loop32 color={"#fff"} className="login-page--icon" />
        </div>
      </div>

      <h2 className="login-page__content--title forgot-password">
        {translate("login.forgetPasswordPage.title")}
      </h2>

      <div className="login-page__content--under-title m-t--xxs">
        {translate("login.forgetPasswordPage.message")}
      </div>

      <Divider className="login-page__content--divider" />

      <div className="login-page__content--form">
        <div className="login-page__password m-b--sm">
          <FormItem message={errorMessageEmail}>
            <InputTextLogin
              inputType="text"
              label={translate("login.forgetPasswordPage.email")}
              suffix={<Email16 />}
              value={email}
              onChange={onChangeEmail}
              placeHolder={translate(
                "login.forgetPasswordPage.placeholder.email"
              )}
            />
          </FormItem>
        </div>

        <div className="login-page__button-wrapper m-b--sm">
          <Button
            icon={<ArrowRight16 />}
            className="login-button btn--lg"
            onClick={onSendMail}
          >
            {translate("login.continueButtonLabel")}
          </Button>
        </div>

        <div className="login-page__button--go-back" onClick={showLogin}>
          <ArrowLeft16 />
          <div className="go-back__label">
            {translate("login.turnBackLoginPageButtonLabel")}
          </div>
        </div>
      </div>
    </div>
  );
}

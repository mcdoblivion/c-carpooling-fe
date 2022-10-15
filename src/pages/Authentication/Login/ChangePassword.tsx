import React from "react";
import { Button, FormItem } from "react3l-ui-library";
import { Divider } from "antd";
import { ArrowLeft16, Loop32, Unlocked16 } from "@carbon/icons-react";
import InputTextLogin from "./InputTextLogin/InputTextLogin";

export interface ChangePasswordProps {
  onChangeNewPass?: (ev: any) => void;
  onChangeConfirmPassword?: (ev: any) => void;
  onChangePass?: () => void;
  checkPass?: boolean;
  confirmPass?: string;
  showLogin?: () => void;
  newPass?: string;
  translate?: any;
}
export default function ChangePassword({
  checkPass,
  onChangeNewPass,
  onChangeConfirmPassword,
  confirmPass,
  onChangePass,
  showLogin,
  newPass,
  translate,
}: ChangePasswordProps) {
  return (
    <div>
      <div className="login-page__content--logo">
        <div>
          <Loop32 color={"#fff"} className="login-page--icon" />
        </div>
      </div>

      <h2 className="login-page__content--title forgot-password">
        {translate("login.changePasswordPage.title")}
      </h2>

      <div className="login-page__content--under-title m-t--xxs">
        {translate("login.changePasswordPage.message")}
      </div>

      <Divider className="login-page__content--divider" />

      <div className="login-page__content--form">
        <div className="login-page__password m-b--sm">
          <FormItem>
            <InputTextLogin
              inputType="password"
              label={translate("login.changePasswordPage.newPassword")}
              value={newPass}
              onChange={onChangeNewPass}
              placeHolder={translate(
                "login.changePasswordPage.placeholder.newPassword"
              )}
            />
          </FormItem>
        </div>

        <div className="login-page__password m-b--sm">
          <FormItem>
            <InputTextLogin
              inputType="password"
              label={translate("login.changePasswordPage.passwordConfirmation")}
              value={confirmPass}
              onChange={onChangeConfirmPassword}
              placeHolder={translate(
                "login.changePasswordPage.placeholder.passwordConfirmation"
              )}
            />
          </FormItem>
        </div>

        <div className="login-page__button-wrapper m-b--sm">
          <Button
            icon={<Unlocked16 />}
            className="login-button btn--lg"
            onClick={onChangePass}
          >
            {translate("login.changePasswordPage.changePasswordButtonLabel")}
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

import { Loop32, ArrowRight16, ArrowLeft16 } from "@carbon/icons-react";
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
  onChangeNewPass?: (event: any) => void;
  email?: string;
  newPass?: string;
}

export default function ForgotPassword({
  onChangeEmail,
  onSendMail,
  showLogin,
  onChangeNewPass,
  email,
  newPass,
}: ForgotPasswordProps) {
  return (
    <div>
      <div className="login-page__content--logo">
        <div>
          <Loop32 color={"#fff"} className="login-page--icon" />
        </div>
      </div>

      <h2 className="login-page__content--title forgot-password">
        Đổi mật khẩu
      </h2>

      <div className="login-page__content--under-title m-t--xxs">
        Chúng tôi có thể giúp bạn đổi lại mật khẩu, sau khi bạn cung cấp thông
        tin Email dùng để đăng ký tài khoản. Vui lòng nhập Email bên dưới và bấm
        Tiếp tục.
      </div>

      <Divider className="login-page__content--divider" />

      <div className="login-page__content--form">
        <div className="login-page__password m-b--sm">
          <FormItem>
            <InputTextLogin
              inputType="text"
              label="Email"
              value={email}
              onChange={onChangeEmail}
              placeHolder="Nhập email đăng ký"
            />
          </FormItem>
        </div>
        <div className="login-page__password m-b--sm">
          <FormItem>
            <InputTextLogin
              inputType="password"
              label="Mật khẩu mới"
              value={newPass}
              onChange={onChangeNewPass}
              placeHolder="Nhập mật khẩu mới"
            />
          </FormItem>
        </div>
        <div className="login-page__button-wrapper m-b--sm">
          <Button
            icon={<ArrowRight16 />}
            className="login-button btn--lg"
            onClick={onSendMail}
          >
            Tiếp tục
          </Button>
        </div>

        <div className="login-page__button--go-back" onClick={showLogin}>
          <ArrowLeft16 />
          <div className="go-back__label">Quay lại trang đăng nhâp</div>
        </div>
      </div>
    </div>
  );
}

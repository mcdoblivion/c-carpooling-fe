import { ArrowLeft16, ArrowRight16, Loop32 } from "@carbon/icons-react";
import { Divider } from "antd";
// import Countdown from "react-countdown";
// import OtpInput from "react-otp-input";
import { Button, FormItem } from "react3l-ui-library";
import InputTextLogin from "./InputTextLogin/InputTextLogin";

export interface GetOtpProps {
  onChangeOtp?: (ev: any) => void;
  onSendOtp?: () => void;
  onSendMail?: () => void;
  showLogin?: () => void;
  otp?: string;
  errorMessageOtp?: any;
  translate?: any;
}

export default function GetOtp({
  onChangeOtp,
  onSendMail,
  onSendOtp,
  showLogin,
  otp,
  errorMessageOtp,
  translate,
}: GetOtpProps) {
  return (
    <div>
      <div className="login-page__content--logo">
        <div>
          <Loop32 color={"#fff"} className="login-page--icon" />
        </div>
      </div>

      <h2 className="login-page__content--title forgot-password">
        {translate("login.getOtpPage.title")}
      </h2>

      <div className="login-page__content--under-title m-t--xxs">
        {translate("login.getOtpPage.message")}
      </div>

      <Divider className="login-page__content--divider" />

      <div className="login-page__content--form">
        <div className="login-page__password m-b--sm">
          <FormItem message={errorMessageOtp}>
            <InputTextLogin
              inputType="text"
              label={translate("login.getOtpPage.otp")}
              value={otp}
              onChange={onChangeOtp}
              placeHolder={translate("login.getOtpPage.placeholder.otp")}
            />
          </FormItem>
        </div>

        <div className="login-page__button-wrapper m-b--sm">
          <Button
            icon={<ArrowRight16 />}
            className="login-button btn--lg"
            onClick={onSendOtp}
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

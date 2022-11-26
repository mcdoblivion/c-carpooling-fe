import { ArrowLeft16, ArrowRight16, Loop32 } from "@carbon/icons-react";
import { Divider } from "antd";
import { Button, FormItem } from "react3l-ui-library";
import InputTextLogin from "../InputTextLogin/InputTextLogin";

export interface GetOtpProps {
  onChangeOtp?: (ev: any) => void;
  onSendOtp?: () => void;
  showSignup?: () => void;
  otp?: string;
}

export default function GetOtp({
  onChangeOtp,
  onSendOtp,
  showSignup,
  otp,
}: GetOtpProps) {
  return (
    <div>
      <div className="login-page__content--logo">
        <div>
          <Loop32 color={"#fff"} className="login-page--icon" />
        </div>
      </div>

      <h2 className="login-page__content--title forgot-password">
        Xác thực Email
      </h2>

      <div className="login-page__content--under-title m-t--xxs">
        Hệ thống đã gửi một mail kèm mã OTP tới địa chỉ Email bạn vừa nhập. Vui
        lòng kiểm tra hộp thư và điền thông tin mã OTP sau đó bấm Xác thực.
      </div>

      <Divider className="login-page__content--divider" />

      <div className="login-page__content--form">
        <div className="login-page__password m-b--sm">
          <FormItem>
            <InputTextLogin
              inputType="text"
              label="OTP"
              value={otp}
              onChange={onChangeOtp}
              placeHolder="Nhập mã OTP"
            />
          </FormItem>
        </div>

        <div className="login-page__button-wrapper m-b--sm">
          <Button
            icon={<ArrowRight16 />}
            className="login-button btn--lg"
            onClick={onSendOtp}
          >
            Xác thực
          </Button>
        </div>

        <div className="login-page__button--go-back" onClick={showSignup}>
          <ArrowLeft16 />
          <div className="go-back__label">Quay lại trang đăng ký</div>
        </div>
      </div>
    </div>
  );
}

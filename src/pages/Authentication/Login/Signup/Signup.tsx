import { Checkbox, Divider } from "antd";
import { useState } from "react";
import nameof from "ts-nameof.macro";
import useSignup from "./SignupService";
import { Loop32, UserAvatar16, View16, Login16 } from "@carbon/icons-react";
import { FormItem, Button } from "react3l-ui-library";
import LoginHeader from "../LoginHeader";
import InputTextLogin from "../InputTextLogin/InputTextLogin";
import { useHistory } from "react-router";
import { LOGIN_ROUTE } from "config/route-consts";
import GetOtp from "./GetOtp";
function Signup() {
  const [appUser, setAppUser] = useState<any>({
    usernameOrEmail: "",
    password: "",
  });

  const {
    signupVisible,
    getOtpVisible,
    handleChangeOtp,
    handleSendOtp,
    showSignup,
    handleChangeField,
    handleEnter,
    handleSignup,
    otp,
  } = useSignup(appUser, setAppUser);
  const history = useHistory();

  return (
    <div className="login-page">
      <LoginHeader />
      <div className="login-page__content d-flex align-items-start m-l--xxl">
        {signupVisible && (
          <div className="main-content-form">
            <div>
              <div className="login-page__content--logo">
                <div>
                  <Loop32 color={"#fff"} className="login-page--icon" />
                </div>
              </div>
              <h2 className="login-page__content--title">Đăng ký</h2>

              <Divider className="login-page__content--divider" />

              <div className="login-page__content--form">
                <div className="login-page__username m-b--sm">
                  <FormItem>
                    <InputTextLogin
                      inputType="text"
                      label="Email"
                      suffix={<UserAvatar16 />}
                      value={appUser.email}
                      onChange={handleChangeField(nameof(appUser.email))}
                      placeHolder="Nhập email"
                      onKeyDown={handleEnter}
                    />
                  </FormItem>
                </div>
                <div className="login-page__password m-b--sm">
                  <FormItem>
                    <InputTextLogin
                      inputType="password"
                      label="Mật khẩu"
                      suffix={<View16 />}
                      value={appUser.password}
                      onChange={handleChangeField(nameof(appUser.password))}
                      placeHolder="Vui lòng nhập mật khẩu"
                      onKeyDown={handleEnter}
                    />
                  </FormItem>
                </div>

                <div className="login-page__button-wrapper m-b--lg">
                  <Button
                    icon={<Login16 />}
                    className="login-button btn--lg"
                    onClick={handleSignup}
                  >
                    Đăng ký
                  </Button>
                </div>

                <div className="remember-password pointer m-b--md">
                  <Checkbox>
                    <span className="remember-password_label">
                      Nhớ mật khẩu
                    </span>
                  </Checkbox>
                </div>
                <Divider className="login-page__content--divider" />

                <div
                  style={{
                    color: "#fff",
                    textAlign: "left",
                    paddingBottom: "60px",
                  }}
                  className="contact-admin"
                  onClick={() => {
                    return history.push(LOGIN_ROUTE);
                  }}
                >
                  Đã có tài khoản?{" "}
                  <span style={{ color: "var(--palette-blue-40)" }}>
                    Quay lại trang đăng nhập
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        {getOtpVisible && (
          <GetOtp
            onChangeOtp={handleChangeOtp}
            onSendOtp={handleSendOtp}
            otp={otp}
            showSignup={showSignup}
          />
        )}

        <div>
          <img
            src={require("assets/images/carpooling.png").default}
            alt=""
            width={"70%"}
          />
        </div>
      </div>
    </div>
  );
}

export default Signup;

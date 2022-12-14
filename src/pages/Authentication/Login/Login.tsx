import { Checkbox, Divider, Spin } from "antd";
import { useState } from "react";
import nameof from "ts-nameof.macro";
import "./Login.scss";
import useLogin from "./LoginService";
import LoginHeader from "./LoginHeader";
import { Loop32, UserAvatar16, View16, Login16 } from "@carbon/icons-react";
import { FormItem, Button } from "react3l-ui-library";
import InputTextLogin from "./InputTextLogin/InputTextLogin";
import GetOtp from "./GetOtp";
import ForgotPassword from "./ForgotPassword";
import { useHistory } from "react-router";
import { SIGNUP_ROUTE } from "config/route-consts";

function Login() {
  const [appUser, setAppUser] = useState<any>({
    usernameOrEmail: "",
    password: "",
  });

  const {
    loading,
    otp,
    email,
    newPass,
    loginVisible,
    forgotPasswordVisible,
    getOtpVisible,
    showForgotPassword,
    handleChangeEmail,
    handleChangeOtp,
    handleSendOtp,
    handleChangeNewPass,
    handleSendMail,
    showLogin,
    handleLogin,
    handleChangeField,
    handleEnter,
  } = useLogin(appUser, setAppUser);
  const history = useHistory();
  return (
    <Spin spinning={loading}>
      <div className="login-page">
        <LoginHeader />
        <div className="login-page__content d-flex align-items-start m-l--xxl">
          <div className="main-content-form">
            {loginVisible && (
              <div>
                <div className="login-page__content--logo">
                  <div>
                    <Loop32 color={"#fff"} className="login-page--icon" />
                  </div>
                </div>
                <h2 className="login-page__content--title">Đăng nhập</h2>

                <Divider className="login-page__content--divider" />

                <div className="login-page__content--form">
                  <div className="login-page__username m-b--sm">
                    <FormItem>
                      <InputTextLogin
                        inputType="text"
                        label="Tên đăng nhập"
                        suffix={<UserAvatar16 />}
                        value={appUser.usernameOrEmail}
                        onChange={handleChangeField(
                          nameof(appUser.usernameOrEmail)
                        )}
                        placeHolder="Nhập tên đăng nhập"
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
                      onClick={handleLogin}
                    >
                      Đăng nhập
                    </Button>
                  </div>

                  <div className="remember-password pointer m-b--max justify-content-between">
                    <Checkbox>
                      <span className="remember-password_label">
                        Nhớ mật khẩu
                      </span>
                    </Checkbox>
                    <span
                      onClick={showForgotPassword}
                      style={{
                        color: "var(--palette-blue-40)",
                        cursor: "pointer",
                      }}
                    >
                      Quên mật khẩu
                    </span>
                  </div>

                  <Divider className="login-page__content--divider" />

                  <div className="m-y--sm another-login">Đăng nhập khác</div>

                  <div
                    className="login-page__button-wrapper m-b--lg"
                    style={{ position: "relative" }}
                  >
                    <Button
                      type="outline-primary"
                      icon={
                        <img
                          src={require("assets/images/Google.svg").default}
                          alt=""
                        />
                      }
                      className="login-button btn--lg login-button--outline"
                    >
                      Đăng nhập với Google
                    </Button>
                    <div id="google-login-div"></div>
                  </div>

                  <div
                    className="login-page__button-wrapper m-b--lg"
                    style={{ position: "relative" }}
                  >
                    <Button
                      type="outline-primary"
                      icon={
                        <img
                          src={require("assets/images/Facebook.svg").default}
                          alt=""
                        />
                      }
                      className="login-button btn--lg login-button--outline"
                    >
                      Đăng nhập với Facebook
                    </Button>
                    <div id="google-login-div"></div>
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
                      return history.push(SIGNUP_ROUTE);
                    }}
                  >
                    Chưa có tài khoản?{" "}
                    <span style={{ color: "var(--palette-blue-40)" }}>
                      Đăng ký tài khoản mới
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          {forgotPasswordVisible && (
            <ForgotPassword
              onChangeEmail={handleChangeEmail}
              onChangeNewPass={handleChangeNewPass}
              onSendMail={handleSendMail}
              showLogin={showLogin}
              email={email}
              newPass={newPass}
            />
          )}

          {getOtpVisible && (
            <GetOtp
              onChangeOtp={handleChangeOtp}
              onSendOtp={handleSendOtp}
              otp={otp}
              showLogin={showLogin}
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
    </Spin>
  );
}

export default Login;

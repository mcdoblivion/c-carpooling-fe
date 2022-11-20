import { Checkbox, Divider } from "antd";
import { useState } from "react";
import nameof from "ts-nameof.macro";
import "./Login.scss";
import useLogin from "./LoginService";
import LoginHeader from "./LoginHeader";
import { Loop32, UserAvatar16, View16, Login16 } from "@carbon/icons-react";
import { FormItem, Button } from "react3l-ui-library";
import InputTextLogin from "./InputTextLogin/InputTextLogin";

function Login() {
  const [appUser, setAppUser] = useState<any>({
    usernameOrEmail: "",
    password: "",
  });
  const [errorMessageUsername, setErrorMessageUsername] =
    useState<string>(null);
  const [errorMessagePass, setErrorMessagePass] = useState<string>(null);

  const { handleLogin, handleChangeField, handleEnter } = useLogin(
    appUser,
    setAppUser,
    setErrorMessageUsername,
    setErrorMessagePass
  );

  return (
    <>
      <div className="login-page">
        <LoginHeader />

        <div className="login-page__content d-flex align-items-start m-l--xxl">
          <div className="main-content-form">
            {
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
                    <FormItem message={errorMessageUsername}>
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
                    <FormItem message={errorMessagePass}>
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
                      disabled={
                        errorMessagePass !== null ||
                        errorMessageUsername !== null
                      }
                    >
                      Đăng nhập
                    </Button>
                  </div>

                  <div className="remember-password pointer m-b--max">
                    <Checkbox>
                      <span className="remember-password_label">
                        Nhớ mật khẩu
                      </span>
                    </Checkbox>
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
                  >
                    Cần hỗ trợ?{" "}
                    <span style={{ color: "var(--palette-blue-40)" }}>
                      Liên hệ admin
                    </span>
                  </div>
                </div>
              </div>
            }
          </div>

          <div>
            <img
              src={require("assets/images/carpooling.png").default}
              alt=""
              width={"70%"}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;

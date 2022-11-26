import { AppUser } from "models/AppUser";
import React, { useCallback, useState } from "react";
import { authRepository } from "repositories/auth-repository";
import { userRepository } from "repositories/user-repository";
import authenticationService from "services/common-services/authentication-service";
import store from "store";
import { updateUser } from "store/global-state/actions";
import { AxiosError } from "axios";
import { notification } from "antd";
import { LOGIN_ROUTE } from "config/route-consts";
import { handleErrorNoti } from "views/AddressView/AddressHook";

export default function useLogin(appUser: any, setAppUser: any) {
  const [loginVisible, setLoginVisible] = useState(true);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [getOtpVisible, setGetOtpVisible] = useState(false);
  const [email, setEmail] = useState<string>(null);
  const [otp, setOtp] = useState<string>(null);
  const [newPass, setNewPass] = useState<string>(null);

  const showForgotPassword = () => {
    setLoginVisible(false);
    setForgotPasswordVisible(true);
  };
  const showLogin = () => {
    setLoginVisible(true);
    setForgotPasswordVisible(false);
    setGetOtpVisible(false);
    setOtp(null);
    setEmail(null);
    setNewPass(null);
  };
  const handleLogin = useCallback(() => {
    authRepository.login(appUser).subscribe(
      (res) => {
        if (res.isSuccess && res.data.access_token) {
          const bearerToken = JSON.stringify(`Bearer ${res.data.access_token}`);
          userRepository
            .getMe(`Bearer ${res.data.access_token}`)
            .subscribe((result: AppUser) => {
              if (result) {
                store.dispatch(updateUser(result));
                localStorage.setItem("token", bearerToken);
                localStorage.setItem(
                  "currentUserInfo",
                  JSON.stringify(result.data)
                );

                window.location.href = "/";
              } else {
                authenticationService.logout();
              }
            });
        }
      },
      (error) => {
        if (error.response && error.response.status === 400) {
          handleErrorNoti(error);
        }
      }
    );
  }, [appUser]);

  const handleChangeEmail = useCallback((event) => {
    setEmail(event);
  }, []);

  // handle change otp
  const handleChangeOtp = useCallback((event) => {
    setOtp(event);
  }, []);

  // SendOtp

  const handleSendOtp = useCallback(() => {
    userRepository
      .forgotPassword({
        usernameOrEmail: email,
        newPassword: newPass,
        otp: otp,
      })
      .subscribe(
        () => {
          notification.success({
            placement: "bottomRight",
            message: "Đổi mật khẩu thành công",
          });
          window.location.href = LOGIN_ROUTE;
        },
        (error: AxiosError<AppUser>) => {
          if (error.response && error.response.status === 400) {
            handleErrorNoti(error);
          }
        }
      );
  }, [email, newPass, otp]);

  // Send mail to get otp
  const handleSendMail = useCallback(() => {
    userRepository
      .forgotPassword({ usernameOrEmail: email, newPassword: newPass })
      .subscribe(
        () => {
          setForgotPasswordVisible(false);
          setGetOtpVisible(true);
        },
        (error: any) => {
          if (error.response && error.response.status === 400) {
            handleErrorNoti(error);
          }
        }
      );
  }, [email, newPass]);

  // Get new pass word
  const handleChangeNewPass = useCallback((event) => {
    setNewPass(event);
  }, []);

  const handleSetValue = useCallback(
    (field: string, value?: string | number | boolean | null) => {
      setAppUser({
        ...appUser,
        [field]: value,
        errors: undefined,
      });
    },
    [appUser, setAppUser]
  );

  const handleChangeField = useCallback(
    (field: string) => {
      return (value: string) => {
        return handleSetValue(field, value);
      };
    },
    [handleSetValue]
  );
  const handleEnter = useCallback(
    (ev: React.KeyboardEvent<HTMLInputElement>) => {
      if (ev.key === "Enter") {
        handleLogin();
      }
    },
    [handleLogin]
  );
  return {
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
  };
}

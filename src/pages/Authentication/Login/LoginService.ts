import { notification } from "antd";
import { AxiosError } from "axios";
import { LOGIN_ROUTE } from "config/route-consts";
import { AppUser } from "models/AppUser";
import React, { useCallback, useEffect, useState } from "react";
import { authRepository } from "repositories/auth-repository";
import { userRepository } from "repositories/user-repository";
import store from "store";
import { updateUser } from "store/global-state/actions";
import { handleErrorNoti } from "views/AddressView/AddressHook";

export default function useLogin(appUser: any, setAppUser: any) {
  const [loading, setLoading] = useState(false);
  const [loginVisible, setLoginVisible] = useState(true);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [getOtpVisible, setGetOtpVisible] = useState(false);
  const [email, setEmail] = useState<string>(null);
  const [otp, setOtp] = useState<string>(null);
  const [newPass, setNewPass] = useState<string>(null);

  useEffect(() => {
    document.title = "Đăng nhập";
  }, []);

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

  const showOtp = () => {
    setLoginVisible(false);
    setForgotPasswordVisible(false);
    setGetOtpVisible(true);
    setOtp(null);
  };

  const handleLogin = useCallback(() => {
    setLoading(true);

    authRepository.login({ ...appUser, ...(otp && { otp }) }).subscribe(
      (res) => {
        setLoading(false);

        if (res?.data?.access_token) {
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
              }
            });
        } else {
          showOtp();
        }
      },
      (error) => {
        handleErrorNoti(error);
        setLoading(false);
      }
    );
  }, [appUser, otp]);

  const handleChangeEmail = useCallback((event) => {
    setEmail(event);
  }, []);

  // handle change otp
  const handleChangeOtp = useCallback((event) => {
    setOtp(event);
  }, []);

  // SendOtp

  const handleSendOtp = useCallback(() => {
    // 2FA
    if (!newPass) {
      handleLogin();
    } else {
      // create new password
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
            handleErrorNoti(error);
          }
        );
    }
  }, [email, handleLogin, newPass, otp]);

  // Send mail to get otp
  const handleSendMail = useCallback(() => {
    userRepository
      .forgotPassword({ usernameOrEmail: email, newPassword: newPass })
      .subscribe(
        () => {
          showOtp();
        },
        (error: any) => {
          handleErrorNoti(error);
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
  };
}

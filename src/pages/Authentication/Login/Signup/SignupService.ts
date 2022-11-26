import { AppUser } from "models/AppUser";
import React, { useCallback, useState } from "react";
import { authRepository } from "repositories/auth-repository";
import { AxiosError } from "axios";
import { notification } from "antd";
import { handleErrorNoti } from "views/AddressView/AddressHook";
import { LOGIN_ROUTE } from "config/route-consts";
import { useHistory } from "react-router";

export default function useSignup(appUser: any, setAppUser: any) {
  const [getOtpVisible, setGetOtpVisible] = useState(false);
  const [otp, setOtp] = useState<string>(null);
  const [signupVisible, setSignupVisible] = useState(true);
  const history = useHistory();

  const showSignup = () => {
    setGetOtpVisible(false);
    setOtp(null);
    setSignupVisible(true);
  };
  const handleSignup = useCallback(() => {
    authRepository.signup(appUser).subscribe(
      (res) => {
        setGetOtpVisible(true);
        setSignupVisible(false);
      },
      (error) => {
        if (error.response && error.response.status === 400) {
          handleErrorNoti(error);
        }
      }
    );
  }, [appUser]);

  // handle change otp
  const handleChangeOtp = useCallback((event) => {
    setOtp(event);
  }, []);

  // SendOtp

  const handleSendOtp = useCallback(() => {
    authRepository
      .verifySignup({
        otp: otp,
      })
      .subscribe(
        () => {
          notification.success({
            placement: "bottomRight",
            message: "Xác thực thành công",
            description:
              "Hiện tại bạn có thể tiếp tục đăng nhập vào hệ thống bằng tài khoản vừa đăng ký",
          });
          history.push(LOGIN_ROUTE);
        },
        (error: AxiosError<AppUser>) => {
          if (error.response && error.response.status === 400) {
            handleErrorNoti(error);
          }
        }
      );
  }, [history, otp]);

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
        handleSignup();
      }
    },
    [handleSignup]
  );
  return {
    signupVisible,
    getOtpVisible,
    handleChangeOtp,
    handleSendOtp,
    showSignup,
    otp,
    handleChangeField,
    handleEnter,
    handleSignup,
  };
}

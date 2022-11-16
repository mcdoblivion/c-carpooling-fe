import React, { useCallback } from "react";
import { authRepository } from "repositories/auth-repository";
import { PAYMENT_ROUTE, USER_PREVIEW_ROUTE } from "config/route-consts";
import { userRepository } from "repositories/user-repository";
import { AppUser } from "models/AppUser";
import store from "store";
import { updateUser } from "store/global-state/actions";
import authenticationService from "services/common-services/authentication-service";
export default function useLogin(
  appUser: any,
  setAppUser: any,
  setErrorMessageUsername: any,
  setErrorMessagePass: any
) {
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
                if (!result.data.userProfile) {
                  window.location.href = `${USER_PREVIEW_ROUTE}?id=${result.data.id}`;
                } else window.location.href = PAYMENT_ROUTE;
              } else {
                authenticationService.logout();
              }
            });
        }
      },
      (error) => {
        if (error.response && error.response.status === 400) {
          const { username, password } = error.response.data?.errors;
          if (typeof username !== "undefined")
            setErrorMessageUsername(username);
          if (typeof password !== "undefined") setErrorMessagePass(password);
        }
      }
    );
  }, [appUser, setErrorMessagePass, setErrorMessageUsername]);

  const handleSetValue = useCallback(
    (field: string, value?: string | number | boolean | null) => {
      setAppUser({
        ...appUser,
        [field]: value,
        errors: undefined,
      });
      setErrorMessagePass(null);
      setErrorMessageUsername(null);
    },
    [appUser, setAppUser, setErrorMessagePass, setErrorMessageUsername]
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
    handleLogin,
    handleChangeField,
    handleEnter,
  };
}

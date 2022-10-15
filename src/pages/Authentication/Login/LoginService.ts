import React, { useCallback } from "react";
import { authRepository } from "repositories/auth-repository";
import { USER_ROUTE } from "config/route-consts";
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
          localStorage.setItem(
            "token",
            JSON.stringify(`Bearer ${res.data.access_token}`)
          );
          window.location.href = USER_ROUTE;
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

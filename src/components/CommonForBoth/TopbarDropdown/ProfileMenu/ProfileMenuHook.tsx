// import { useGlobalState } from "app/AppStore";
import { AppUser } from "models/AppUser";
import React, { useEffect, useRef, useState } from "react";
import { Model } from "react3l-common";
import { userRepository } from "repositories/user-repository";
import authenticationService from "services/common-services/authentication-service";

export class Site extends Model {
  public id?: number;
  public code?: string;
  public name?: string;
  public icon?: string;
}

export class AppUserSiteMapping extends Model {
  public appUserId?: number;
  public siteId?: number;
  public enabled?: boolean;
  public site?: Site;
}

export function useProfileMenu() {
  const token = JSON.parse(localStorage.getItem("token"));
  const [user, setUser] = useState(new AppUser());
  const firstLoad = useRef(true);

  useEffect(() => {
    if (firstLoad) {
      userRepository.getMe(token).subscribe((res) => setUser(res?.data));
      firstLoad.current = false;
    }
  }, [token]);

  const [profileDrop, setProfileDrop] = React.useState(false);
  const handleLogout = React.useCallback(() => {
    authenticationService.logout();
  }, []);
  const handleClickToProfile = React.useCallback(() => {
    window.location.href = `/users-preview?id=${user?.id}`;
  }, [user?.id]);
  const handleClickToChangePassword = React.useCallback(() => {
    window.location.href = `/portal/app-user/app-user-master?idChangePassword=${user?.id}`;
  }, [user?.id]);

  const handleToggerProfile = React.useCallback(() => {
    setProfileDrop(!profileDrop);
  }, [profileDrop]);

  const handleMouseLeaveAll = React.useCallback(() => {
    setProfileDrop(false);
  }, []);

  return {
    user,
    handleLogout,
    handleClickToChangePassword,
    handleToggerProfile,
    profileDrop,
    handleMouseLeaveAll,
    handleClickToProfile,
  };
}

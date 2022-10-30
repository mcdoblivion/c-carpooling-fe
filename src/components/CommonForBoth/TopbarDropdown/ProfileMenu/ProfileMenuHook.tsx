// import { useGlobalState } from "app/AppStore";
import React from "react";
import { Model } from "react3l-common";
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
  const user = JSON.parse(localStorage.getItem("currentUserInfo"));

  const [profileDrop, setProfileDrop] = React.useState(false);
  const handleLogout = React.useCallback(() => {
    authenticationService.logout();
  }, []);
  const handleClickToProfile = React.useCallback(() => {
    window.location.href = `/portal/app-user/app-user-detail?id=${user?.id}`;
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

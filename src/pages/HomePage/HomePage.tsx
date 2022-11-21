import { Spin } from "antd";
import { ADMIN } from "config/consts";
import {
  CARPOOLING_GROUP_NORMAL_ROUTE,
  USER_PREVIEW_ROUTE,
  USER_ROUTE,
} from "config/route-consts";
import { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { getCurrentUserInfo } from "store";

function Home() {
  const [nextRoute, setNextRoute] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const userInfo = getCurrentUserInfo();

      if (userInfo) {
        const { role, userProfile, id: userId } = userInfo;

        if (role === ADMIN) {
          setNextRoute(USER_ROUTE);
          return clear;
        }

        if (userProfile) {
          setNextRoute(CARPOOLING_GROUP_NORMAL_ROUTE);
          return clear;
        }

        setNextRoute(`${USER_PREVIEW_ROUTE}?id=${userId}`);
      }
    }, 100);

    const clear = () => clearInterval(interval);

    return clear;
  }, []);

  return nextRoute ? (
    <Redirect to={nextRoute} />
  ) : (
    <Spin spinning={true}>
      <div className="page-content" />
    </Spin>
  );
}

export default Home;

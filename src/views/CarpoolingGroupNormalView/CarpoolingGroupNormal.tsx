import { AppUser } from "models/AppUser";
import { useCallback, useEffect, useRef, useState } from "react";
import { userRepository } from "repositories/user-repository";
import CarpoolingGroupFinding from "./CarpoolingGroupFinding/CarpoolingGroupFinding";
import CarpoolingGroupInformation from "./CarpoolingGroupInformation/CarpoolingGroupInformation";

/* end individual import */

function CarpoolingGroupNormal() {
  const token = JSON.parse(localStorage.getItem("token"));
  const [user, setUser] = useState(new AppUser());
  const firstLoad = useRef(true);

  const getUserInfo = useCallback(
    () => userRepository.getMe(token).subscribe((res) => setUser(res?.data)),
    [token]
  );

  useEffect(() => {
    if (firstLoad) {
      getUserInfo();
      firstLoad.current = false;
    }
  }, [getUserInfo]);

  useEffect(() => {
    document.title = "Nhóm đi chung xe";
  }, []);

  return (
    <>
      {user.carpoolingGroupId ? (
        <CarpoolingGroupInformation user={user} />
      ) : (
        <CarpoolingGroupFinding user={user} reloadUser={getUserInfo} />
      )}
    </>
  );
}
export default CarpoolingGroupNormal;

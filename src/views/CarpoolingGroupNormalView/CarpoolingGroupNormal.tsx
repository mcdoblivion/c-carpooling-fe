import { AppUser } from "models/AppUser";
import { useEffect, useRef, useState } from "react";
import { userRepository } from "repositories/user-repository";
import CarpoolingGroupFinding from "./CarpoolingGroupFinding/CarpoolingGroupFinding";
import CarpoolingGroupInformation from "./CarpoolingGroupInformation/CarpoolingGroupInformation";

/* end individual import */

function CarpoolingGroupNormal() {
  const token = JSON.parse(localStorage.getItem("token"));
  const [user, setUser] = useState(new AppUser());
  const firstLoad = useRef(true);
  useEffect(() => {
    if (firstLoad) {
      userRepository.getMe(token).subscribe((res) => setUser(res?.data));
      firstLoad.current = false;
    }
  }, [token]);

  return (
    <>
      {user.carpoolingGroupId ? (
        <CarpoolingGroupInformation />
      ) : (
        <CarpoolingGroupFinding user={user} />
      )}
    </>
  );
}
export default CarpoolingGroupNormal;

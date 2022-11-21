import CarpoolingGroupInformation from "./CarpoolingGroupInformation/CarpoolingGroupInformation";

/* end individual import */

function CarpoolingGroupNormal() {
  const user = JSON.parse(localStorage.getItem("currentUserInfo"));

  return <>{user.carpoolingGroupId ? <CarpoolingGroupInformation /> : <></>}</>;
}
export default CarpoolingGroupNormal;

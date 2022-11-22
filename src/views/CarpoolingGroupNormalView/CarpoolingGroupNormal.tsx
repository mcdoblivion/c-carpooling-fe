import CarpoolingGroupFinding from "./CarpoolingGroupFinding/CarpoolingGroupFinding";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import CarpoolingGroupInformation from "./CarpoolingGroupInformation/CarpoolingGroupInformation";

/* end individual import */

function CarpoolingGroupNormal() {
  const user = JSON.parse(localStorage.getItem("currentUserInfo"));

  return <>{user.carpoolingGroupId ? <CarpoolingGroupFinding /> : <></>}</>;
}
export default CarpoolingGroupNormal;

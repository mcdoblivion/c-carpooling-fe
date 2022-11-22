import CarpoolingGroupFinding from "./CarpoolingGroupFinding/CarpoolingGroupFinding";
import CarpoolingGroupInformation from "./CarpoolingGroupInformation/CarpoolingGroupInformation";

/* end individual import */

function CarpoolingGroupNormal() {
  const user = JSON.parse(localStorage.getItem("currentUserInfo"));

  return (
    <>
      {!user.carpoolingGroupId ? (
        <CarpoolingGroupInformation />
      ) : (
        <CarpoolingGroupFinding user={user} />
      )}
    </>
  );
}
export default CarpoolingGroupNormal;

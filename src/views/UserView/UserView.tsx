import { USER_ROUTE } from "config/route-consts";
import { ProtectedRoute } from "pages/Authentication/ProtectedRoute";
import { Switch } from "react-router";
import UserMaster from "./UserMaster/UserMaster";

function UserView() {
  return (
    <Switch>
      <ProtectedRoute
        path={USER_ROUTE}
        key={USER_ROUTE}
        component={UserMaster}
        auth={true}
      />
    </Switch>
  );
}

export { UserMaster };
export default UserView;

import { Redirect, Route } from "react-router";
import { FORBIDENT_ROUTE } from "config/consts";

export function ProtectedRoute({ component: Component, auth, ...rest }: any) {
  return (
    <Route
      {...rest}
      render={(props) =>
        auth === true ? (
          <Component {...props} />
        ) : (
          <Redirect to={FORBIDENT_ROUTE} />
        )
      }
    />
  );
}

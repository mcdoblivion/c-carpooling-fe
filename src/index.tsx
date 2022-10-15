import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./i18n/i18n";
import { Provider } from "react-redux";
import WebFont from "webfontloader";
import store from "./store";
import { PrivateRoute } from "pages/Authentication/PrivateRoute";
// Import scss
import "assets/scss/theme.scss";
import Login from "pages/Authentication/Login/Login";

WebFont.load({
  google: {
    families: ["Inter"],
  },
});

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route
          exact
          path={`${process.env.PUBLIC_URL}/login`}
          component={Login}
        />
        <PrivateRoute path="/" />
      </Switch>
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));
serviceWorker.unregister();

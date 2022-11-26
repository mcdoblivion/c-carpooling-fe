import PropTypes from "prop-types";
import React, { Reducer, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { connect, ConnectedComponent } from "react-redux";
import ErrorPage, { errorHandler } from "pages/ErrorPage/ErrorPage";

// layouts Format
import VerticalLayout from "../components/VerticalLayout";
import HorizontalLayout from "../components/HorizontalLayout";
import { AppAction, appReducer, AppState } from "./AppReducer";
import { AppStateContext } from "./AppContext";
import { reloadUserInfo } from "store";
import { useHistory } from "react-router";

const App = (props: any) => {
  const Layout: ConnectedComponent<any, any> = React.useMemo(() => {
    let layoutCls;
    switch (props.layout.layoutType) {
      case "horizontal":
        layoutCls = HorizontalLayout;
        break;
      default:
        layoutCls = VerticalLayout;
        break;
    }
    return layoutCls;
  }, [props.layout.layoutType]);

  const [appState, appDispatch] = React.useReducer<
    Reducer<AppState, AppAction>
  >(appReducer, {});

  const history = useHistory();

  useEffect(() => {
    history.listen(() => {
      reloadUserInfo();
    });
  }, []);

  return (
    <React.Fragment>
      <ErrorBoundary FallbackComponent={ErrorPage} onError={errorHandler}>
        <AppStateContext.Provider value={{ appState, appDispatch }}>
          <Layout>{props.children}</Layout>
        </AppStateContext.Provider>
      </ErrorBoundary>
    </React.Fragment>
  );
};

App.propTypes = {
  layout: PropTypes.any,
};

const mapStateToProps = (state: any) => {
  return {
    layout: state.Layout,
    authorized: state.Authorized,
  };
};

export default connect(mapStateToProps, {})(App);

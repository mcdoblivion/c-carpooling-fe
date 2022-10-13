import PropTypes from "prop-types";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { connect, ConnectedComponent } from "react-redux";
import { AppStateContext } from "./AppContext";
import { authorizationService } from "services/common-services/authorization-service";
import ErrorPage, { errorHandler } from "pages/ErrorPage/ErrorPage";

// layouts Format
import VerticalLayout from "../components/VerticalLayout";
import HorizontalLayout from "../components/HorizontalLayout";

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

  const { authorizationData } = authorizationService.useAuthorizedApp();

  return (
    <React.Fragment>
      <ErrorBoundary FallbackComponent={ErrorPage} onError={errorHandler}>
        <AppStateContext.Provider value={authorizationData}>
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

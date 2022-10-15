import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const Logout = (props: any) => {
  useEffect(() => {
    localStorage.removeItem("token");
    props.history.push("/login");
  });

  return <></>;
};

Logout.propTypes = {
  history: PropTypes.object,
};

export default withRouter(connect(null, {})(Logout));

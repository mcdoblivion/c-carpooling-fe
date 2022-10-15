import React from "react";
import { CheckmarkOutline16 } from "@carbon/icons-react";
import { Divider } from "antd";
export interface SuccessResultViewProps {
  translate: any;
}
function SuccessResultView({ translate }: SuccessResultViewProps) {
  return (
    <div>
      <div className="login-page__content--logo m-b--sm">
        <div>
          <CheckmarkOutline16 color={"#fff"} className="login-page--icon" />
        </div>
      </div>

      <h2 className="login-page__content--title forgot-password">
        {translate("login.success.title")}
      </h2>

      <div className="login-page__content--under-title m-t--xxs">
        {translate("login.success.message")}
      </div>

      <Divider className="login-page__content--divider" />
    </div>
  );
}

export default SuccessResultView;

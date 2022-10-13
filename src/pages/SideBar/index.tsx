import React from "react";
import { Layout } from "antd";
import Sidebar from "components/HorizontalLayout/Sidebar/Sidebar";
import { Route, Switch } from "react-router";

const { Content, Sider } = Layout;

function SideBarPage() {
  return (
    <React.Fragment>
      <div> SideBar </div>
      <Layout style={{ marginTop: "48px", height: "100vh" }}>
        <Sider width={200} style={{ background: "white" }}>
          <Sidebar />
        </Sider>
        <Layout>
          <Content>
            <Switch>
              <Route exact path="/secondary-color/test1">
                <div style={{ padding: "20px" }}>hello</div>
              </Route>
              <Route exact path="/secondary-color/test2">
                <div style={{ padding: "20px" }}>hello2</div>
              </Route>
              <Route exact path="/secondary-color/test1/test1.1">
                <div style={{ padding: "20px" }}>hello3</div>
              </Route>
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </React.Fragment>
  );
}

export default SideBarPage;

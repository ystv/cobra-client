import React, { useEffect } from "react";
import "./App.css";
import { tokenRefresh } from "./commonFunctions";
import { Switch, Route, Link, useLocation } from "react-router-dom";
import Stats from "./pages/Stats";
import { Layout, Menu } from "antd";
import Streamkeys from "./pages/Streamkeys";

const { Header, Footer } = Layout;

function App() {
  useEffect(tokenRefresh, []);
  const loc = useLocation();

  function defaultSelectedKey() {
    switch (loc.pathname) {
      case "/streamkeys":
        return ["2"];

      default:
        return ["1"];
    }
  }

  return (
    <Layout>
      <Header className="light-header" style={{ padding: "0 25px" }}>
        <Menu mode="horizontal" defaultSelectedKeys={defaultSelectedKey()}>
          <Menu.Item key={"0"} disabled style={{ width: "100px", margin: 0 }}>
            <img src="/cobra.svg" alt="" />
          </Menu.Item>
          <Menu.Item key="1">
            <Link to="/">Stats</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/streamkeys">StreamKeys</Link>
          </Menu.Item>
          <Menu.Item disabled key="3">
            BOAs
          </Menu.Item>
          <Menu.Item disabled key="4">
            ASPs
          </Menu.Item>
          <Menu.Item disabled key="5">
            Relays
          </Menu.Item>
        </Menu>
      </Header>

      <div className="App-Container">
        <div className="App-Content">
          <Switch>
            <Route path="/streamkeys">
              <Streamkeys />
            </Route>
            <Route path="/">
              <Stats />
            </Route>
          </Switch>
        </div>
      </div>
      <Footer style={{ textAlign: "center" }}>
        COBRA - created by Ben Allen
      </Footer>
    </Layout>
  );
}

export default App;

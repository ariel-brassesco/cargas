import "./styles/main.css";
import "@fortawesome/fontawesome-free/js/all";
import React, { Component } from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";

//Import Routes
import { PROFILE_CLIENT, PROFILE_INSPECTOR, DASHBOARD, LOGIN } from "./routes";
// Import Components
import PrivateRoute from "./components/PrivateRoute";
// Import Pages
import ClientProfile from "./pages/ClientProfile";
import InspectorProfile from "./pages/InspectorProfile";
import DashboardPage from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";

class App extends Component {
  render() {
    return (
      <BrowserRouter basename="">
        <Switch>
          <Route exact path={LOGIN}>
            <LoginPage />
          </Route>

          <PrivateRoute path={DASHBOARD} redirect={LOGIN}>
            <DashboardPage />
          </PrivateRoute>

          <PrivateRoute path={PROFILE_CLIENT} redirect={LOGIN}>
            <ClientProfile />
          </PrivateRoute>

          <PrivateRoute path={PROFILE_INSPECTOR} redirect={LOGIN}>
            <InspectorProfile />
          </PrivateRoute>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;

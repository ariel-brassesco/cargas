import React, { useEffect } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// Import Routes
import {
  LOGIN,
  PROFILE_ADMIN,
  DASHBOARD_ORDERS,
  DASHBOARD_CLIENTS,
  DASHBOARD_INSPECTORS,
  DASHBOARD_PRODUCTS,
  // DASHBOARD_REPORTS
} from "../routes";
// Import Pages
import DashboardClientsPage from "./DashboardClient";
import DashboardOrdersPage from "./DashboardOrder";
import DashboardInspectorsPage from "./DashboardInspector";
import DashboardProductsPage from "./DashboardProduct";
// import DashboardReportsPage from "./DashboardReport";
//Import Components
import { Navbar } from "../components/Navbar";
// Import Actions
import {
  fetchClients,
  fetchInspectors,
  fetchProducts,
  fetchOrders,
} from "../actions/dashboardActions";
// Import Getters
import { getAccount } from "../reducers/dashboardReducer";
// Import Types
import { Account, userTypeMapRoute } from "../types/account";

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const account: Account = useSelector((state: any) => getAccount(state));
  const router = useHistory();

  useEffect(() => {
    dispatch(fetchClients());
    dispatch(fetchInspectors());
    dispatch(fetchProducts());
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    if (!account?.id) router.push(LOGIN);
    else router.push(userTypeMapRoute[account.user_type]);
  }, [account, router]);

  return (
    <div>
      <Navbar />

      <div className="container">
        <div className="columns">
          <div className="column">
            <Switch>
              <Route exact path={PROFILE_ADMIN}>
                <DashboardOrdersPage />
              </Route>

              <Route path={DASHBOARD_ORDERS}>
                <DashboardOrdersPage />
              </Route>

              <Route path={DASHBOARD_INSPECTORS}>
                <DashboardInspectorsPage />
              </Route>

              <Route path={DASHBOARD_CLIENTS}>
                <DashboardClientsPage />
              </Route>

              <Route path={DASHBOARD_PRODUCTS}>
                <DashboardProductsPage />
              </Route>
              {/*<Route path={DASHBOARD_REPORTS}>
                <DashboardReportsPage />
              </Route> */}
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";

// Import Pages
import InspectorHomePage from "./InspectorHomePage";
import InspectorStartPage from "./InspectorStartOrder";
import InspectorLoadingPage from "./InspectorLoadingOrder";
import InspectorClosingPage from "./InspectorClosingOrder";
import InspectorCheckRowsPage from "./InspectorCheckRows";
//Import Actions
import { logout } from "../actions/dashboardActions";
import { fetchOrders, initOrder } from "../actions/inspectorActions";
// Import Getters
import { getAccount } from "../reducers/dashboardReducer";
import { getOrders } from "../reducers/inspectorReducer";
// Import Types
import { Account } from "../types/account";
import { Order } from "../types/order";
// Import Routes
import {
  PROFILE_INSPECTOR,
  INSPECTOR_START_ORDER,
  INSPECTOR_LOADING_ORDER,
  INSPECTOR_CLOSING_ORDER,
  INSPECTOR_CHECK_ROWS,
} from "../routes";

const InspectorProfile: React.FC = () => {
  const dispatch = useDispatch();
  const account: Account = useSelector((state: any) => getAccount(state));
  const orders: Order[] = useSelector((state: any) => getOrders(state));

  useEffect(() => {
    dispatch(fetchOrders(account.id));
  }, [dispatch, account]);

  const handleLogout = useCallback(() => dispatch(logout()), [dispatch]);

  const handleInitOrder = (order: number) => async (data: FormData) => {
    data.append("order", String(order));
    await dispatch(initOrder(data));
  };

  const { first_name, last_name } = account;

  return (
    <div>
      <div className="hero is-primary">
        <div className="hero-body">
          <p className="title">Hola {`${first_name} ${last_name}`} !</p>
          <button
            type="button"
            className="button is-danger"
            onClick={handleLogout}
          >
            <strong>Salir</strong>
          </button>
        </div>
      </div>

      <div className="container">
        <div className="columns">
          <div className="column is-full">
            <Switch>
              <Route exact path={PROFILE_INSPECTOR}>
                <InspectorHomePage />
              </Route>

              <Route
                path={`${INSPECTOR_START_ORDER}/:orderId`}
                render={({ match }) => {
                  const order = orders.find(
                    ({ id }) => match.params.orderId === String(id)
                  );

                  return order ? (
                    <InspectorStartPage
                      order={order}
                      onOk={handleInitOrder(order.id)}
                    />
                  ) : null;
                }}
              />

              <Route
                path={`${INSPECTOR_LOADING_ORDER}/:orderId`}
                render={({ match }) => {
                  const order = orders.find(
                    ({ id }) => match.params.orderId === String(id)
                  );

                  return order ? <InspectorLoadingPage order={order} /> : null;
                }}
              />

              <Route
                path={`${INSPECTOR_CLOSING_ORDER}/:orderId`}
                render={({ match }) => {
                  const order = orders.find(
                    ({ id }) => match.params.orderId === String(id)
                  );

                  return order ? <InspectorClosingPage order={order} /> : null;
                }}
              />

              <Route
                path={`${INSPECTOR_CHECK_ROWS}/:orderId`}
                render={({ match }) => {
                  const order = orders.find(
                    ({ id }) => match.params.orderId === String(id)
                  );

                  return order ? (
                    <InspectorCheckRowsPage order={order} />
                  ) : null;
                }}
              />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectorProfile;

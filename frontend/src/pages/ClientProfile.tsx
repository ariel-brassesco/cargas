import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";

// Import Components
import ClientHomePage from "./ClientHomePage";
import ClientDetailOrder from "./ClientDetailOrder";
//Import Actions
import { logout } from "../actions/dashboardActions";
import { fetchClient, fetchOrders } from "../actions/clientActions";
// Import Types
import { Account } from "../types/account";
import { Client } from "../types/client";
import { Order } from "../types/order";
// Import Getters
import { getAccount } from "../reducers/dashboardReducer";
import { getClient, getOrders } from "../reducers/clientReducer";
// Import Routes
import { PROFILE_CLIENT, CLIENT_ORDER_DETAIL } from "../routes";

const ClientProfile: React.FC = () => {
  const dispatch = useDispatch();
  const account: Account = useSelector((state: any) => getAccount(state));
  const client: Client = useSelector((state: any) => getClient(state));
  const orders: Order[] = useSelector((state: any) => getOrders(state));

  useEffect(() => {
    dispatch(fetchClient(account.id));
    dispatch(fetchOrders(account.id));
  }, [dispatch, account]);

  const handleLogout = useCallback(() => dispatch(logout()), [dispatch]);

  return (
    <div>
      <div className="hero is-primary">
        <div className="hero-body">
          <p className="title">{`Hola ${client.company}`}!</p>
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
              <Route exact path={PROFILE_CLIENT}>
                <ClientHomePage />
              </Route>

              <Route
                path={`${CLIENT_ORDER_DETAIL}/:orderId`}
                render={({ match }) => {
                  const order = orders.find(
                    ({ id }) => match.params.orderId === String(id)
                  );

                  return order ? <ClientDetailOrder order={order} /> : null;
                }}
              />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;

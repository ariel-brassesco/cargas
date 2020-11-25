import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { getAccount } from "../reducers/dashboardReducer";
// import { Account } from "../types/account";

type Props = {
  account: any;
  redirect: string;
};

const PrivateRoute: React.FC<Props> = ({
  children,
  account,
  redirect,
  ...props
}) => (
  <Route
    {...props}
    render={({ location }) =>
      account.id ? (
        children
      ) : (
        <Redirect
          to={{
            pathname: redirect,
            state: { from: location },
          }}
        />
      )
    }
  />
);

const mapStateToProps = (state: any) => ({
  account: getAccount(state),
});

export default connect(mapStateToProps)(PrivateRoute);

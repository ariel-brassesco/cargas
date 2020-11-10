import React, { Component } from 'react';
import { connect } from "react-redux";

// Import Types
import { Account } from "../types/account";
// Import Getters
import { getAccount } from "../reducers/dashboardReducer";

type Props = {
    account: Account;
}

class ClientProfile extends Component<Props> {
    render() {
        const { account } = this.props;
        return (
            <div>
                Hello {account.username}!
            </div>
        );
    }
}

const mapStateToProps = (state: any) => ({
   account: getAccount(state),
});

export default connect(mapStateToProps)(ClientProfile);
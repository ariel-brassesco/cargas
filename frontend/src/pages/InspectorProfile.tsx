import React, { Component } from 'react';
import { connect } from "react-redux";
// Import Getters
import { getAccount } from "../reducers/dashboardReducer";
// Import Types
import { Account } from "../types/account";

type Props = {
    account: Account;
}

class InspectorProfile extends Component<Props> {
    render() {
        return (
            <div>
                Hola {this.props.account.username}!
            </div>
        );
    }
}
const mapStateToProps = (state: any) => ({
    account: getAccount(state),
 });
 
 export default connect(mapStateToProps)(InspectorProfile);

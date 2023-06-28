import React from "react";
import { connect } from "react-redux";

class Admin extends React.Component {
    render() {
        // This page should only display for approved wallets
        return (
            <>
                <h1>Admin</h1>
                <h2>Settings for Bromidian Whitelist</h2>
                <div>Set presale or whitelist: Presale</div>
                <div>Set project description: ...</div>
                <div>Set project whitepaper link: ...</div>
                <div>Set destination wallet: ...</div>
                <div>Set purchase token: ...</div>
                <div>Set payout token: BRO</div>
            </>
        )
    }
}

export default connect()(Admin);

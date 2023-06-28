import StatefulComponent from "../StatefulComponent";
import { connect } from "react-redux";
import { toast } from "react-toastify";

class NFTList extends StatefulComponent {
    onUnstake = (tokenId) => {
        console.log("clicked unstake", tokenId);
        this.props.dispatch({ type: "UNSTAKE_TOKEN", payload: { tokenId: tokenId } });
    }

    onStake = (tokenId) => {
        console.log("clicked stake", tokenId);
        this.props.dispatch({ type: "STAKE_TOKEN", payload: { tokenId: tokenId } });
    }

    onStakeAll = () => {
        if (!this.props.account) {
            toast.info('Please connect wallet!', {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        if (this.props.unstakedTokens.length > 0) {
            var tokenIds = this.props.unstakedTokens.map(item => item.id);
            this.props.dispatch({ type: "STAKE_ALL_TOKENS", payload: { tokenIds: tokenIds } });
        }
        else {
            toast.info('There is no token to stake!', {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    onClaim = () => {
        if (!this.props.account) {
            toast.info('Please connect wallet!', {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        //if (currentReward > 0)
            this.props.dispatch({ type: "CLAIM_TOKEN", payload: {} });
        /*else {
            toast.info('There is no reward!', {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }*/
    }

    onUnstakeAll = () => {
        if (!this.props.account) {
            toast.info('Please connect wallet!', {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        if (this.props.stakedTokens.length > 0) {
            console.log(this.props.stakedTokens);
            var tokenIds = this.props.stakedTokens.map(item => item.id);
            this.props.dispatch({ type: "UNSTAKE_ALL_TOKENS", payload: { tokenIds: tokenIds } });
        }
        else {
            toast.info('There is no token to unstake!', {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    render() {
        return (
            <>
                <div className="nft-list">
                    {
                        (this.props.type === "staked") && this.props.stakedTokens &&
                        this.props.stakedTokens.map(item => {
                            return (
                                <div key={item.id} className="nft-list-item">
                                    <img src={item.url} width="auto" height="100" />
                                    <div className="ft-list-item-button-container">
                                        <button onClick={ () => this.onUnstake(item.id) }>Unstake</button>
                                    </div>
                                </div>
                            );
                        })
                    }
                    {
                        (this.props.type === "unstaked") && this.props.unstakedTokens &&
                        this.props.unstakedTokens.map(item => {
                            return (
                                <div key={item.id} className="nft-list-item">
                                    <img key="image" src={item.url} width="auto" height="100" />
                                    <div className="ft-list-item-button-container">
                                        <button onClick={ () => this.onStake(item.id) }>Stake</button>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
                {
                    (this.props.type === "staked") &&
                    (
                        <div className="nft-list-button-container">
                            <button className="button-style" onClick={() => this.onClaim()}>Claim</button>
                            <button className="button-style" onClick={() => this.onUnstakeAll()}>Unstake All</button>
                        </div>
                    )
                }
                {
                    (this.props.type === "unstaked") &&
                    (
                        <div className="nft-list-button-container">
                            <button className="button-style" onClick={() => this.onStakeAll()}>Stake All</button>
                        </div>
                    )
                }
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        account : state.account,
        stakedTokens: state.stakedTokens,
        unstakedTokens: state.unstakedTokens,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NFTList);

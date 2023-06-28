import StatefulComponent from "../components/StatefulComponent";
import { Toast } from "../components/common/Toast";
import { Footer } from "../components/common/Footer";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import NFTList from "../components/invest/NFTList";
//import Popup from '../components/invest/Popup/Popup';

class Home extends StatefulComponent {
    constructor(props) {  
        super(props);
        this.state = {
            ...this.state,
            isOpen: false,
            currentReward: 0,
        }
        this.setState(this.state);
    }

    componentDidMount = () => {
        setInterval(this.updateReward, 1000);
    
        this.props.dispatch({ type: "GET_CONTRACT_INFO", payload: {} });
    }

    togglePopup = () => {
        this.setState({...this.state, isOpen: !this.state.isOpen});
    };

    onConnect = async () => {
        if (window.ethereum) {
            await window.ethereum.enable();
            this.props.dispatch({
                type: 'CONNECT_WALLET',
            });
        }
        else {
            toast.info('Please install metamask on your device', {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        this.togglePopup();
    }

    updateReward = () => {
        //console.log("updateReward:", this.props.account);
        if (this.props.account) {
            let time = parseInt(Date.now() / 1000);
            var reward = this.props.unclaimedRewards + (time - this.props.timeOfLastUpdate) * this.props.amountStaked * this.props.rewardsPerUnitTime / this.props.timeUnit;
            reward = parseFloat(reward).toFixed(5);
            this.setState({ ...this.state, currentReward: reward });
        }
        else
            this.setState({ ...this.state, currentReward: 0 });
    }

    render() {
        return (
            <>
                <div id="main">
                    <Toast/>
                    {
                        /*this.state.isOpen && 
                        (
                            <Popup content={
                                <>
                                    <div className="connectTitle">Connect a wallet</div>
                                    <div className="walletHolder">
                                        <div className="walletItem">
                                            <a onClick={() => this.onConnect()} href="#root" >
                                                <img alt="MetaMask" src="/img/MetaMask_Fox.png" />
                                                MetaMask
                                                <span className="arrowRightBtn">
                                                    <i className="fa-solid fa-chevron-right"></i>
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                </>
                            }
                            handleClose={ () => this.togglePopup() }
                        />)*/
                    }
                    <div className="top-area">
                        <div className="NewHolder">
                            <div className="amoutToken">
                                <label>Liquidity:</label>
                                {
                                    this.props.totalBalance > 0 ? (<span>{this.props.totalBalance}</span>) : (<span>0</span>)
                                }
                            </div>
                            <div className="amoutToken">
                                <label>Rewards:</label>
                                {
                                    this.state.currentReward > 0 ? (<span>{this.state.currentReward}</span>) : (<span>0</span>)
                                }
                            </div>
                        </div>
                        {
                            this.props.account ?
                            (<div className="account-address">{ this.props.account.slice(0, 6) + "..." + this.props.account.slice(38)}</div>)
                            :
                            (<div className="top-button-container"><button onClick={() => this.onConnect()} className="button-style">Connect wallet</button></div>)
                        }
                    </div>
                    <section className="bottom-area">
                        <div className="nft-list-container">
                            <h1>Unstaked NFT</h1>
                            <NFTList type="unstaked" />
                        </div>
                        <div className="nft-list-container">
                            <h1>Staked NFT</h1>
                            <NFTList type="staked" />
                        </div>
                    </section>
                </div>
                <Footer/>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        account : state.account,
        rewardsPerUnitTime: state.rewardsPerUnitTime,
        timeUnit: state.timeUnit,
        totalBalance: state.totalBalance,
        stakedTokens: state.stakedTokens,
        unstakedTokens: state.unstakedTokens,
        amountStaked: state.amountStaked,
        timeOfLastUpdate: state.timeOfLastUpdate,
        unclaimedRewards: state.unclaimedRewards
    };
}

const mapDispatchToProps = dispatch => {
    return {
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

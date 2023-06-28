import { createStore } from 'redux'
import Web3 from 'web3';
import config from '../config/index';
import { toast } from 'react-toastify';

const _initialState = {
    account: "",
    rewardsPerUnitTime: 0,
    timeUnit: 1,
    totalBalance: 0,
    stakedTokens: [],
    unstakedTokens: [],
    amountStaked: 0,
    timeOfLastUpdate: 0,
    unclaimedRewards: 0
};

const globalWeb3 = new Web3(config.mainNetUrl);
const provider = Web3.providers.HttpProvider(config.mainNetUrl);
const web3 = new Web3(Web3.givenProvider || provider);

const NFTStakeCon = new web3.eth.Contract(config.NFTStakeAbi, config.NFTStakeAddress);
const ERC721Con = new web3.eth.Contract(config.ERC721Abi, config.ERC721Address);

var NFTInfoDict = {};

console.log("Provider", config.mainNetUrl);
console.log("NFT staking contract", config.NFTStakeAddress);
console.log("ERC721 token contract", config.ERC721Address);

const stake = async (state, tokenIds) => {
    if (!state.account) {
        alertMsg("Please connect metamask!");
        return;
    }

    try {
        await NFTStakeCon.methods.stake(tokenIds).send({ from: state.account });
        store.dispatch({ type: "GET_ACCOUNT_INFO" });
    } catch (e) {
        console.log(e);
    }
}

const claim = async (state) => {
    if (!state.account) {
        alertMsg("Please connect metamask!");
        return;
    }
    try {
        await NFTStakeCon.methods.claimRewards().send({ from: state.account });
        store.dispatch({ type: "GET_ACCOUNT_INFO" });
    } catch (e) {
        console.log(e);
    }
}

const unstake = async (state, tokenIds) => {
    if (!state.account) {
        alertMsg("Please connect metamask!");
        return;
    }

    try {
        await NFTStakeCon.methods.withdraw(tokenIds).send({ from: state.account });
        store.dispatch({ type: "GET_ACCOUNT_INFO" });
    } catch (e) {
        console.log(e);
    }
}

const getAccountInfo = async (state) => {
    if (!state.account) {
        alertMsg("Please connect metamask!");
        return;
    }
    
    try {
        //var account = '0xdd89316929A975D7F65507BD3Cb4DD2f724ef07c';
        //var account = '0x79ca15110241605ae97f73583f5c3f140506fb80';
        var account = state.account;

        var staker = await NFTStakeCon.methods.stakers(account).call();
        console.log("Staker:", staker);

        var stakeInfo = await NFTStakeCon.methods.getStakeInfo(account).call();
        console.log("Stake Info:", stakeInfo);

        var stakedTokens = [];
        for (let i = 0; i < stakeInfo._tokensStaked.length; i++) {
            let tokenId = stakeInfo._tokensStaked[i];
            if (!NFTInfoDict[tokenId]) {
                let tokenURI = await ERC721Con.methods.tokenURI(tokenId).call();
                //console.log("token Id:", tokenId);
                //console.log("token URI:", tokenURI);
    
                let res = await fetch(tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/"));
                res = await res.json();
                console.log("NFT Info:", res);
                NFTInfoDict[tokenId] = {
                    url: res.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
                    //name: res.name,
                    //description: res.description
                };
            }

            stakedTokens = [...stakedTokens, {
                id: tokenId,
                url: NFTInfoDict[tokenId].url,
                //name: NFTInfoDict[tokenId].name,
                //description: NFTInfoDict[tokenId].description
            }];
        }
        console.log("Staked Tokens:", stakedTokens);

        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: config.NFT_SERVER_API_KEY
            }
        };
        
        var allNFTs = [];
        var continuation = true;
        while (continuation) {
            var res = await fetch(`${config.NFT_SERVER_API_URL}/${account}?chain=polygon&page_size=50&include=metadata&contract_address=${config.ERC721Address}`, options);
            res = await res.json();
            allNFTs = [...allNFTs, ...res.nfts];
            continuation = res.continuation;
        }
        //console.log("All NFTs:", allNFTs);

        var unstakedTokens = allNFTs.map(item => {
            var tokenURI = "";
            if (item.file_url)
                tokenURI = item.file_url;
            
            if (!NFTInfoDict[item.token_id]) {
                NFTInfoDict[item.token_id] = {
                    url: tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
                };
            }
            
            return {
                id: item.token_id,
                url: NFTInfoDict[item.token_id].url
            };
        });
        console.log("Unstaked Tokens:", unstakedTokens);

        store.dispatch({
            type: "RETURN_DATA",
            payload: {
                stakedTokens: stakedTokens,
                unstakedTokens: unstakedTokens,
                amountStaked: staker ? parseFloat(staker.amountStaked).toFixed(2) : 0,
                timeOfLastUpdate: staker ? parseFloat(staker.timeOfLastUpdate).toFixed(2) : 0,
                unclaimedRewards: staker ? globalWeb3.utils.fromWei(staker.unclaimedRewards.toString(), 'ether') : 0
            }
        });
    } catch (e) {
        console.log(e);
    }
}

const getContractInfo = async (state) => {
    if (!NFTStakeCon) {
        alertMsg("Please install metamask!");
        return;
    }

    try {
        var totalBalance = await NFTStakeCon.methods.getRewardTokenBalance().call();
        totalBalance = globalWeb3.utils.fromWei(totalBalance.toString(), 'ether');
        console.log("Total Balance: ", totalBalance);

        var rewardsPerUnitTime = await NFTStakeCon.methods.getRewardsPerUnitTime().call();
        rewardsPerUnitTime = globalWeb3.utils.fromWei(rewardsPerUnitTime.toString(), 'ether');

        var timeUnit = await NFTStakeCon.methods.getTimeUnit().call();
        timeUnit = parseFloat(timeUnit).toFixed(2);

        console.log("RewardsPerUnitTime: ", rewardsPerUnitTime);
        console.log("TimeUnit: ", timeUnit);

        store.dispatch({
            type: "RETURN_DATA",
            payload: {
                rewardsPerUnitTime: rewardsPerUnitTime,
                timeUnit: timeUnit,
                totalBalance: parseFloat(totalBalance).toFixed(2)
            }
        })
    } catch (e) {
        console.log(e);
    }
}

const reducer = (state = _initialState, action) => {
    switch (action.type) {
        case "GET_CONTRACT_INFO":
            getContractInfo(state);
            break;

        case "GET_ACCOUNT_INFO":
            console.log("Running action GET_ACCOUNT_INFO...");
            if (!checkNetwork(state.chainId)) {
                changeNetwork();
                return state;
            }
            getAccountInfo(state);
            break;

        case "STAKE_TOKEN":
            if (!checkNetwork(state.chainId)) {
                changeNetwork();
                return state;
            }
            stake(state, [action.payload.tokenId]);
            break;

        case "STAKE_ALL_TOKENS":
            if (!checkNetwork(state.chainId)) {
                changeNetwork();
                return state;
            }
            stake(state, action.payload.tokenIds);
            break;

        case "CLAIM_TOKEN":
            if (!checkNetwork(state.chainId)) {
                changeNetwork();
                return state;
            }
            claim(state);
            break;

        case "UNSTAKE_TOKEN":
            if (!checkNetwork(state.chainId)) {
                changeNetwork();
                return state;
            }
            unstake(state, [action.payload.tokenId]);
            break;

        case "UNSTAKE_ALL_TOKENS":
            if (!checkNetwork(state.chainId)) {
                changeNetwork();
                return state;
            }
            unstake(state, action.payload.tokenIds);
            break;

        case 'CONNECT_WALLET':
            if (!checkNetwork(state.chainId)) {
                changeNetwork();
                return state;
            }

            web3.eth.getAccounts((err, accounts) => {
                if (accounts.length > 0) {
                    store.dispatch({
                        type: 'RETURN_DATA',
                        payload: { account: accounts[0] }
                    });

                    store.dispatch({ type: "GET_ACCOUNT_INFO" });
                }
            })
            break;

        case 'CHECK_NETWORK':
            if (!checkNetwork(state.chainId)) {
                changeNetwork();
                return state;
            }
            return state;

        case 'RETURN_DATA':
            return Object.assign({}, state, action.payload);

        default:
            break;
    }
    return state;
}

const alertMsg = (msg) => {
    toast.info(msg, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}

const checkNetwork = (chainId) => {
    if (web3.utils.toHex(chainId) !== web3.utils.toHex(config.chainId)) {
        alertMsg("Change network to Polygon Mainnet!");
        return false;
    } else {
        return true;
    }
}

const changeNetwork = async () => {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: config.chainId }],
        });
    } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: config.chainId,
                            chainName: 'Avalanche',
                            rpcUrls: [config.mainNetUrl] /* ... */,
                        },
                    ],
                });
            } catch (addError) {
            }
        }
    }
}

if (window.ethereum) {
    window.ethereum.on('accountsChanged', function (accounts) {
        console.log("Account changed: ", accounts);
        if (accounts.length > 0) {
            store.dispatch({
                type: "RETURN_DATA",
                payload: {
                    account: accounts[0]
                }
            });
            store.dispatch({ type: "GET_ACCOUNT_INFO" });
        }
        else {
            store.dispatch({
                type: "RETURN_DATA",
                payload: {
                    account: "",
                    totalBalance: 0,
                    stakedTokens: [],
                    unstakedTokens: [],
                    amountStaked: 0,
                    timeOfLastUpdate: 0,
                    unclaimedRewards: 0
                }
            });
        }
    });

    window.ethereum.on('chainChanged', function (chainId) {
        checkNetwork(chainId);
        store.dispatch({
            type: "RETURN_DATA",
            payload: { chainId: chainId }
        });
    });

    web3.eth.getChainId().then((chainId) => {
        checkNetwork(chainId);
        store.dispatch({
            type: "RETURN_DATA",
            payload: { chainId: chainId }
        });
    })
}

const store = createStore(reducer);
export default store
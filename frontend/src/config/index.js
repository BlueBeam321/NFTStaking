/*
import abi from './StakingContractAbi.json';
import ERC20Abi from './ERC20Abi.json';

// real net, avalanche-c chain
var config = {
    contractAbi: abi,
    ERC20Abi: ERC20Abi,

    // mainNetUrl: "https://polygon.llamarpc.com",            //polygon RPC
    mainNetUrl: "https://data-seed-prebsc-2-s2.binance.org:8545",            //bsc testnet RPC

    chainId: '0x89',    // polygon : '0x89'   
    // chainId: '0x61',    // bsc testnet : '0x97'   

    contractAddress: "0xF20BA1c2F5b88274898A6AE14F46dE86079C105C",      // staking contract address
    // contractAddress: "0xEb0674B84083eC98cbf8838e79a4ef54bfDECf3D",   // testing swap contract address
  
    broAddress: "0xD09E5aef492DbBe11A74c5d1B20e3e0d19653374",           // presale token
    // broAddress: "0x54E7a996cD74AAbA05f4403B196bde17D1654762",        // testing presale token
};*/

import NFTStakeAbi from './NFTStakeAbi.json';
import ERC721Abi from './ERC721Abi.json';

// real net, avalanche-c chain
var config = {
    NFTStakeAbi: NFTStakeAbi,
    ERC721Abi: ERC721Abi,

    //mainNetUrl: "https://polygon.llamarpc.com",                   // polygon RPC
    mainNetUrl: "https://data-seed-prebsc-2-s2.binance.org:8545",   // bsc testnet RPC

    chainId: '0x89',        // polygon : '0x89'   
    //chainId: '0x61',      // bsc testnet : '0x97'   

    NFTStakeAddress: "0x395805794241d667F744FE51dD8aBEf165Ff3670",  // NFT staking contract address
    ERC721Address: "0x5D57780A0794fA9F447C3ED238069ECD68100Cbb",    // ERC721 token contract address

    NFT_SERVER_API_URL: "https://api.nftport.xyz/v0/accounts",
    NFT_SERVER_API_KEY: "9ab697a7-eea2-414e-b088-6658ceb53b4d"
};

export default config; 

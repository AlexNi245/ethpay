"use strict";
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-solhint");
require("@typechain/hardhat");
require("dotenv/config");
require("hardhat-deploy");
require("solidity-coverage");
module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
        // // If you want to do some forking, uncomment this
        // forking: {
        //   url: MAINNET_RPC_URL
        // }
        },
        localhost: {},
    },
    namedAccounts: {
        deployer: {
            default: 0,
            1: 0, // similarly on mainnet it will take the first account as deployer.
        },
        feeCollector: {
            default: 1,
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.4",
            },
            {
                version: "0.6.0",
            },
        ],
    },
    mocha: {
        timeout: 100000,
    },
    typechain: {
        outDir: "typechain",
        target: "ethers-v5",
    },
};

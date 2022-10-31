"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printUSDC = exports.USDC = exports.mockToken = void 0;
const hardhat_1 = require("hardhat");
const mockToken = async (name) => {
    const t = await hardhat_1.ethers.getContractFactory("contracts/ERC20/ERC20.sol:ERC20");
    const token = (await t.deploy(name, name));
    console.log(`${name} @ ${token.address}`);
    return token;
};
exports.mockToken = mockToken;
const USDC = (x) => hardhat_1.ethers.utils.parseUnits(x.toString(), 18);
exports.USDC = USDC;
const printUSDC = (x) => hardhat_1.ethers.utils.formatUnits(x, 18);
exports.printUSDC = printUSDC;

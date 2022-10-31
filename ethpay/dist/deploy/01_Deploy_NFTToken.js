"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const func = async function (hre) {
    let accounts;
    let nftTokenContract;
    accounts = await hre.ethers.getSigners();
    console.log(await accounts[0].getAddress());
    const tokenFactory = (await hre.ethers.getContractFactory("NFTToken", accounts[0]));
    nftTokenContract = await tokenFactory.deploy();
    console.log(`The address the Contract WILL have once mined: ${nftTokenContract.address}`);
    console.log(`The transaction that was sent to the network to deploy the Contract: ${nftTokenContract.deployTransaction.hash}`);
    console.log("The contract is NOT deployed yet; we must wait until it is mined...");
    await nftTokenContract.deployed();
    console.log("Minted...");
};
exports.default = func;
func.id = "nft_token_deploy";
func.tags = ["local"];

import { Signer } from "ethers";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { GatewayRegistry__factory, GatewayRegistry } from "../typechain";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    let accounts: Signer[];
    let gatewayRegistry: GatewayRegistry;

    accounts = await hre.ethers.getSigners();
    

    const gatewayRegistryFactory = (await hre.ethers.getContractFactory(
        "GatewayRegistry",
        accounts[0]
    )) as GatewayRegistry__factory;

    gatewayRegistry = await gatewayRegistryFactory.deploy(
        await accounts[0].getAddress()
    );

    await gatewayRegistry.deployed();
    console.log("Gateway registry deployed at ", gatewayRegistry.address);
};
export default func;
func.id = "create_contracts";
func.tags = ["local"];

import { Signer } from "ethers";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import {
    GatewayRegistry__factory,
    GatewayRegistry,
    Gateway,
    Gateway__factory,
} from "../typechain";

const ONCHAIN_PROCESSOR = process.env.ONCHAIN_PROCESSOR_ADDR;

const WMATIC = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";
const WBTC = "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6";
const USDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    let accounts: Signer[];
    let gatewayRegistry: GatewayRegistry;

    accounts = await hre.ethers.getSigners();

    const gatewayRegistryFactory = (await hre.ethers.getContractFactory(
        "GatewayRegistry",
        accounts[0]
    )) as GatewayRegistry__factory;

    gatewayRegistry = await gatewayRegistryFactory.attach(
        "0x54D101Fe3e171C53D84CEFeec24EFd4c321A22C7"
    );

    //await gatewayRegistry.deployed();

    console.log("Gateway registry deployed at ", gatewayRegistry.address);

    const gatewayFactory = (await hre.ethers.getContractFactory(
        "Gateway",
        accounts[0]
    )) as Gateway__factory;

    const maticGateway = await gatewayFactory.deploy(
        ONCHAIN_PROCESSOR!,
        WMATIC
    );
    console.log(`Matic Gateway deployed @ ${maticGateway.address}}`);

    await maticGateway.deployed();

    const btcGateway = await gatewayFactory.deploy(ONCHAIN_PROCESSOR!, WBTC);
    await btcGateway.deployed();
    console.log(`BTC Gateway deployed @ ${btcGateway.address}}`);

    const usdcGateway = await gatewayFactory.deploy(ONCHAIN_PROCESSOR!, USDC);
    await usdcGateway.deployed();
    console.log(`USDC Gateway deployed @ ${usdcGateway.address}}`);

    const addWmaticTx = await gatewayRegistry.addToken(
        WMATIC,
        maticGateway.address
    );
    await addWmaticTx.wait();
    const addWBtcTx = await gatewayRegistry.addToken(WBTC, btcGateway.address);
    await addWBtcTx.wait();
    const addUsdcTx = await gatewayRegistry.addToken(USDC, usdcGateway.address);
    addUsdcTx.wait();
};
export default func;
func.id = "create_contracts";
func.tags = ["local"];

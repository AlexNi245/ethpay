import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import {
    ERC20,
    Gateway,
    IGateway,
    UsdcGateway,
    UsdcGateway__factory,
} from "typechain";
import { mockToken, printUSDC, USDC } from "./utils/ERC20Utils";

describe.only("Gateways test", () => {
    let deployer: SignerWithAddress;
    let sender: SignerWithAddress;
    let receiver: SignerWithAddress;

    let usdc: ERC20;
    let gateway: Gateway;

    beforeEach(async function () {
        usdc = await mockToken("USDC");
        [deployer, sender, receiver] = await ethers.getSigners();
        await usdc.connect(deployer).transfer(sender.address, USDC(10000));

        const gatewayFactory = ethers.getContractFactory("Gateway");
        gateway = (await (
            await gatewayFactory
        ).deploy(usdc.address)) as Gateway;
    });

    it("teest usdc allowance", async () => {
        const gatewayInitialAllowance = await usdc.allowance(
            sender.address,
            gateway.address
        );

        console.log("initial allowance", printUSDC(gatewayInitialAllowance));

        //Funds gateway with 100 USDC to spend
        await usdc
            .connect(sender)
            .increaseAllowance(gateway.address, USDC(100));

        const gatewayAfterFundAllowance = await usdc.allowance(
            sender.address,
            gateway.address
        );

        console.log(
            "after fund allowance",
            printUSDC(gatewayAfterFundAllowance)
        );
    });
});

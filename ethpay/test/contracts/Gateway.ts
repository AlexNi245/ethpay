import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { ERC20, Gateway } from "typechain";
import { mockToken, printUSDC, USDC } from "./utils/ERC20Utils";

describe("Gateways test", () => {
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

    it("use gateway to send usdc", async () => {
        const receiverInitialBalance = await usdc.balanceOf(receiver.address);
        console.log("Receiver initial balance, ", receiverInitialBalance);

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

        const receipt = await (
            await gateway.transferFrom(
                sender.address,
                receiver.address,
                USDC(25)
            )
        ).wait();

        

        const gatewayAfterSendAllowance = await usdc.allowance(
            sender.address,
            gateway.address
        );

        console.log(
            "after send allowance",
            printUSDC(gatewayAfterSendAllowance)
        );
        const receiverEndBalance = await usdc.balanceOf(receiver.address);
        console.log("Receiver end balance, ", printUSDC(receiverEndBalance));
    });
});

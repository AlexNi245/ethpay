"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const ERC20Utils_1 = require("./utils/ERC20Utils");
describe("Gateways test", () => {
    let deployer;
    let sender;
    let receiver;
    let usdc;
    let gateway;
    beforeEach(async function () {
        usdc = await (0, ERC20Utils_1.mockToken)("USDC");
        [deployer, sender, receiver] = await hardhat_1.ethers.getSigners();
        await usdc.connect(deployer).transfer(sender.address, (0, ERC20Utils_1.USDC)(10000));
        const gatewayFactory = hardhat_1.ethers.getContractFactory("Gateway");
        gateway = (await (await gatewayFactory).deploy(usdc.address));
    });
    it("use gateway to send usdc", async () => {
        const receiverInitialBalance = await usdc.balanceOf(receiver.address);
        console.log("Receiver initial balance, ", receiverInitialBalance);
        const gatewayInitialAllowance = await usdc.allowance(sender.address, gateway.address);
        console.log("initial allowance", (0, ERC20Utils_1.printUSDC)(gatewayInitialAllowance));
        //Funds gateway with 100 USDC to spend
        await usdc
            .connect(sender)
            .increaseAllowance(gateway.address, (0, ERC20Utils_1.USDC)(100));
        const gatewayAfterFundAllowance = await usdc.allowance(sender.address, gateway.address);
        console.log("after fund allowance", (0, ERC20Utils_1.printUSDC)(gatewayAfterFundAllowance));
        const receipt = await (await gateway.transferFrom(sender.address, receiver.address, (0, ERC20Utils_1.USDC)(25))).wait();
        const gatewayAfterSendAllowance = await usdc.allowance(sender.address, gateway.address);
        console.log("after send allowance", (0, ERC20Utils_1.printUSDC)(gatewayAfterSendAllowance));
        const receiverEndBalance = await usdc.balanceOf(receiver.address);
        console.log("Receiver end balance, ", (0, ERC20Utils_1.printUSDC)(receiverEndBalance));
    });
});

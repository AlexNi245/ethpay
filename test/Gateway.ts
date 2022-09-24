import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { ERC20 } from "typechain";
import { mockToken, printUSDC, USDC } from "./utils/ERC20Utils";

describe.only("Gateways test", () => {
    let deployer: SignerWithAddress;
    let sender: SignerWithAddress;
    let receiver: SignerWithAddress;

    let usdc: ERC20;

    beforeEach(async function () {
        usdc = await mockToken("USDC");
        [deployer, sender, receiver] = await ethers.getSigners();
        await usdc.connect(deployer).transfer(sender.address, USDC(10000));
    });

    it("teest usdc allowance", async () => {
        const balance = await usdc.balanceOf(await sender.address);
        console.log(printUSDC(balance));
    });
});

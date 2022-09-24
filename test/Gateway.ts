import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { ERC20 } from "typechain";

describe.only("Gateways test", () => {
    let deployer: SignerWithAddress;
    let sender: SignerWithAddress;
    let receiver: SignerWithAddress;

    let usdc: ERC20;

    beforeEach(async function () {
        usdc = await mockToken("USDC");
        [deployer, sender, receiver] = await ethers.getSigners();
        await usdc.connect(deployer).transfer(sender.address, USDC(100000));
    });
    
    it("teest usdc allowance", async () => {
        const balance = await usdc.balanceOf(await sender.address);
        console.log(balance);
    });
});
export const mockToken = async (name: string): Promise<ERC20> => {
    const t = await ethers.getContractFactory(
        "contracts/ERC20/ERC20.sol:ERC20"
    );
    const token = (await t.deploy(name, name)) as ERC20;
    console.log(`${name} @ ${token.address}`);
    return token;
};

export const USDC = (x: string | number) =>
    ethers.utils.parseUnits(x.toString(), 18);

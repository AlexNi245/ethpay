import { BigNumberish } from "ethers";
import { ethers } from "hardhat";
import { ERC20 } from "../../../typechain";

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

export const printUSDC = (x: BigNumberish) => ethers.utils.formatUnits(x, 18);

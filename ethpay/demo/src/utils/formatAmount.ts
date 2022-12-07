import { BigNumber, ethers } from "ethers";

export const supportedTokens = [
    {
        address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        gateway: "0x571968E5101857541773f22D7d187Bb36458Eab3",
        name: "WMATC",
        decimals: 18,
    },
    {
        address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
        gateway: "0xEb7bfccd9E7c463c7f147B4130220fB40C64b764",
        name: "WBTC",
        decimals: 8,
    },
    {
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        gateway: "0x976fadAeE145C8Ad01F09E892e0F20bddce23C74",
        name: "USDC",
        decimals: 6,
    },
];

export const formatAmount = (amount: BigNumber, token: string) => {
    const tokenObj = supportedTokens.find((t) => t.address === token);

    return ethers.utils.formatUnits(amount, tokenObj!.decimals);
};
export const getTokenName = (token: string) => {
    const tokenObj = supportedTokens.find((t) => t.address === token);
    return tokenObj?.name;
};

import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useContract, useProvider } from "wagmi";
import { ERC20Abi } from "./useTokenInfomation/erc20abit";

const supportedTokens = [
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

export const useTokenInfomation = (address: string) => {
    const provider = useProvider();
    const [isLoading, setisLoading] = useState(true);

    const [allowances, setallowances] = useState<string[]>([]);
    const [balances, setBalances] = useState<string[]>([]);

    const wMatic = useContract({
        address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        abi: ERC20Abi,
        signerOrProvider: provider,
    });
    const wBtcContract = useContract({
        address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
        abi: ERC20Abi,
        signerOrProvider: provider,
    });
    const usdcContract = useContract({
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        abi: ERC20Abi,
        signerOrProvider: provider,
    });
    useEffect(() => {
        if (!address) {
            return;
        }

        const getAllowances = async () => {
            const allowances = await Promise.all([
                wMatic?.allowance(
                    address,
                    "0x571968E5101857541773f22D7d187Bb36458Eab3"
                ),
                wBtcContract?.allowance(
                    address,
                    "0xEb7bfccd9E7c463c7f147B4130220fB40C64b764"
                ),
                usdcContract?.allowance(
                    address,
                    "0x976fadAeE145C8Ad01F09E892e0F20bddce23C74"
                ),
            ]);
            const balances = await Promise.all([
                wMatic?.balanceOf(address),
                wBtcContract?.balanceOf(address),
                usdcContract?.balanceOf(address),
            ]);
            const humanReadableAllowance = allowances.map((a, idx) =>
                ethers.utils.formatUnits(a, supportedTokens[idx].decimals)
            );
            const humanReadableBalances = balances.map((a, idx) =>
                ethers.utils.formatUnits(a, supportedTokens[idx].decimals)
            );

            setallowances(humanReadableAllowance);
            setBalances(humanReadableBalances);
            setisLoading(false);
        };
        getAllowances();
    }, [wMatic, wBtcContract, usdcContract, address]);

    return { isLoading, allowances, balances };
};

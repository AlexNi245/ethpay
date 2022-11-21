import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useContract, useProvider } from "wagmi";
import { ERC20Abi } from "./useAllowance/erc20abit";

const supportedTokens = [
    {
        address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        gateway: "0x891F9aEC186AfC73A0dFdBba66C61806D7943077",
        name: "WMATC",
        decimals: 18,
    },
    {
        address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
        gateway: "0x27D760931173601880693a38416f8A481C1E5214",
        name: "WBTC",
        decimals: 8,
    },
    {
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        gateway: "0xf83C648A28f5194Eb8BE11270Aa0271d36d7802a",
        name: "USDC",
        decimals: 6,
    },
];

export const useAllowance = (address: string) => {
    const provider = useProvider();
    const [isLoading, setisLoading] = useState(true);

    const [allowances, setallowances] = useState<string[]>([]);

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
                    "0x891F9aEC186AfC73A0dFdBba66C61806D7943077"
                ),
                wBtcContract?.allowance(
                    address,
                    "0x27D760931173601880693a38416f8A481C1E5214"
                ),
                usdcContract?.allowance(
                    address,
                    "0xf83C648A28f5194Eb8BE11270Aa0271d36d7802a"
                ),
            ]);
            const humanReadableAllowance = allowances.map((a, idx) =>
                ethers.utils.formatUnits(a, supportedTokens[idx].decimals)
            );
            setallowances(humanReadableAllowance);
            setisLoading(false);
        };
        getAllowances();
    }, [wMatic, wBtcContract, usdcContract, address]);

    return { isLoading, allowances };
};

import { Flex } from "@chakra-ui/react";
import { useBalance } from "wagmi";
import { BalanceTile } from "./BalanceTile";

export const Balances = () => {
    const usdc = useBalance({
        address: "0x7BC910fd07Be5dD2C00E59452B4940F623068E47",
        token: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    });
    const wbtc = useBalance({
        address: "0x7BC910fd07Be5dD2C00E59452B4940F623068E47",
        token: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
    });
    const wmatic = useBalance({
        address: "0x7BC910fd07Be5dD2C00E59452B4940F623068E47",
        token: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    });
    return (
        <Flex justifyContent="space-between" maxW="900px">
            <BalanceTile currency="USDC" amount={usdc.data?.formatted??"0.00"} />

            <BalanceTile currency="wMatic" amount={wmatic.data?.formatted??"0.00"}  />
            <BalanceTile currency="wBtc" amount={wbtc.data?.formatted??"0.00"}  />
        </Flex>
    );
};

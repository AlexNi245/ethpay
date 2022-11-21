import { Box, Flex } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { useTokenInfomation } from "../../hooks/useTokenInfomation";
import { AllowanceTile } from "./AllowanceTile";

export const Header = () => {
    const { address } = useAccount();
    const { balances, allowances } = useTokenInfomation(address as string);
    return (
        <Flex
            bg="blue.400"
            h="50"
            justifyContent="flex-end"
            alignItems="center"
        >
            <Flex>
                <AllowanceTile
                    allowance={allowances[0]}
                    balance={balances[0]}
                    name="wMatic"
                />
                <Box w="4" />
                <AllowanceTile
                    allowance={allowances[1]}
                    balance={balances[1]}
                    name="wBtc"
                />
                <Box w="4" />
                <AllowanceTile
                    allowance={allowances[2]}
                    balance={balances[2]}
                    name="USDC"
                />
                <Box w="8" />
            </Flex>
        </Flex>
    );
};

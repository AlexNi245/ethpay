import { Text, Box } from "@chakra-ui/react";

export const BalanceTile = ({
    currency,
    amount,
}: {
    currency: string;
    amount: string;
}) => {
    return (
        <Box w="250px" p="4" backgroundColor="yellow.300" borderRadius="12">
            <Text fontSize="4xl" fontWeight="bold">
                {currency}
            </Text>
            <Box h="4" />
            <Text px="8" fontSize="2xl">
                {amount}
            </Text>
        </Box>
    );
};

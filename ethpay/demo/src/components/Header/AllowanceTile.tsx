import { Box, Flex, Text } from "@chakra-ui/react";

export const AllowanceTile = ({
    allowance,
    balance,
    name,
}: {
    allowance: string;
    balance: string;
    name: string;
}) => {
    return (
        <Flex>
            <Text fontWeight="bold">{name}</Text>
            <Box w="2" />
            <Flex flexDirection="column">
                <Flex justifyContent="space-between">
                    <Text>Allowance </Text>
                    <Box w="1" />
                    <Text>{allowance}</Text>
                </Flex>
                <Flex justifyContent="space-between">
                    <Text>Balance </Text>
                    <Box w="1" />
                    <Text>{balance}</Text>
                </Flex>
            </Flex>
        </Flex>
    );
};

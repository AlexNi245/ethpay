import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";

export const ListItem = ({
    name,
    currency,
    price,
    onBuy,
}: {
    name: string;
    currency: string;
    price: string;
    onBuy: () => void;
}) => {
    return (
        <Flex
            borderRadius="6px"
            bg="red.300"
            p="2"
            justifyContent="space-between"
        >
            <Flex w="100" flexDirection="column">
                <Text fontSize="lg" fontWeight="bold">
                    {name}
                </Text>
                <Text>
                    Ein beliebiges Item aus dem Onlineshop des Händlers. Sie
                    können es mit {currency} kaufen
                </Text>
            </Flex>
            <Flex alignItems="center">
                <Box>
                    <Text>Balance </Text>
                    <Text>0</Text>
                </Box>
                <Box w="4" />
                <Box>
                    <Text>Price </Text>
                    <Text>{price}</Text>
                </Box>
                <Box w="4" />
                <Button bg="green.300" onClick={onBuy}>
                    Buy
                </Button>
            </Flex>
        </Flex>
    );
};

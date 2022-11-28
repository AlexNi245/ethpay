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
            py="3"
            px="6"
            justifyContent="space-between"
        >
            <Flex flexDirection="column" >
                <Text fontSize="lg" fontWeight="bold">
                    {name}
                </Text>
                <Text>
                    Ein beliebiges Item aus dem Onlineshop des Händlers. Sie
                    können es mit {currency} kaufen
                </Text>
            </Flex>

            <Flex alignItems="center" justifyContent="space-between" w="40%">
                <Box w="12" />
                <Box>
                    <Text>Balance </Text>
                    <Text>0</Text>
                </Box>
                <Box w="12" />
                <Flex
                    w="100%"
                    justifyContent="space-between"
                    alignItems="center"
                >
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
        </Flex>
    );
};

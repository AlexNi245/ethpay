import { Box, Center, Flex, Heading, Text } from "@chakra-ui/react";
import { Balances } from "./Balances/Balances";
import { Payments } from "./Payments/Payments";

export const Merchant = () => {
    return (
        <Box pt="6" px="12">
            <Heading>Balances</Heading>
            <Text>
                Hier sehen sie die Guthaben der einzelnen Währungen des
                Merchants
            </Text>
            <Box h="6" />
            <Balances />
            <Box h="12" />
            <Heading>Payments</Heading>
            <Text>Alle vergangenen Payments</Text>
            <Box h="6" />
            <Flex justifyContent="space-around">

            <Payments />
            </Flex>
        </Box>
    );
};

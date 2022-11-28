import { Box, Flex, Spinner, Text } from "@chakra-ui/react";

export const PaymentConfirmation = () => {


    return (
        <Flex flexDirection="column" alignItems="center">
            <Text fontWeight="bold">Zahlung wird verarbeitet</Text>
            <Box h="2" />
            <Spinner />
            <Box h="2" />
        </Flex>
    );
};

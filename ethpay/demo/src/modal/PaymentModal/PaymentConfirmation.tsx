import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { ModalContext } from "../../context/ModalContext";
import { PaymentModalContext } from "./context/PaymentModalContext";

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

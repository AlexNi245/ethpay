import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { ModalContext } from "../../context/ModalContext";
import { PaymentModalContext, STEPS } from "./context/PaymentModalContext";

export const PaymentOverview = () => {
    const { payment, setSteps } = useContext(PaymentModalContext);
    const { onClose } = useContext(ModalContext);
    const onContinue = () => {
        setSteps(STEPS.Confirmation);
    };

    const { name, receiver, amount, currency } = payment as any;
    return (
        <Flex flexDirection="column">
            <Text fontWeight="bold">
                Bitte authorisieren Sie die folgende Zahlung für {name}
            </Text>
            <Box h="1" />
            <Text>Empfänger: {receiver}</Text>
            <Text>
                Höhe: {amount} {currency}
            </Text>
            <Flex justify="end" mt={4}>
                <Button bg="red.500" onClick={onClose}>
                    Verwerfen
                </Button>
                <Box w="4" />
                <Button bg="green.300" onClick={onContinue}>
                    Bestätigen
                </Button>
            </Flex>
        </Flex>
    );
};

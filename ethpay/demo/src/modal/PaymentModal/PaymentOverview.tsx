import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { useAccount } from "wagmi";
import { ModalContext } from "../../context/ModalContext";
import { PaymentContext } from "../../context/PaymentContext";
import { PaymentModalContext, STEPS } from "./context/PaymentModalContext";

export const PaymentOverview = () => {
    const { payment, setSteps } = useContext(PaymentModalContext);
    const { onClose } = useContext(ModalContext);
    const { makeBtcPayment, makeMaticPayment, makeUsdcPayment } =
        useContext(PaymentContext);
    const { address } = useAccount();
    const { name, receiver, amount, currency, token } = payment as any;

    const onContinue = async () => {
        setSteps(STEPS.Confirmation);
        //WMATIC
        if (token === "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270") {
            console.log("Start wMatic payment");
            await makeMaticPayment(address as string, amount, receiver);
            return onClose();
        }
        //USDC
        if (token === "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174") {
            console.log("Start usdc payment");
            await makeUsdcPayment(address as string, amount, receiver);
            return onClose();
        }
        //WBTC
        if (token === "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6") {
            console.log("Start wbtc payment");
            await makeBtcPayment(address as string, amount, receiver);
            return onClose();
        }
    };

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

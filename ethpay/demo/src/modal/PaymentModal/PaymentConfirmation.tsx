import { Box, Flex, ModalContent, Spinner, Text } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { useAccount } from "wagmi";
import { ModalContext } from "../../context/ModalContext";
import { PaymentContext } from "../../context/PaymentContext";
import { PaymentModalContext } from "./context/PaymentModalContext";

export const PaymentConfirmation = () => {
    const { payment, setSteps } = useContext(PaymentModalContext);
    const { address } = useAccount();
    const { name, receiver, amount, currency, token } = payment as any;
    const { makeMaticPayment, makeBtcPayment, makeUsdcPayment } =
        useContext(PaymentContext);

    const { onClose } = useContext(ModalContext);
    useEffect(() => {
        const pay = async () => {
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

            console.log("UNSUPPORTED TOKEN");
        };
        pay();
    }, []);

    return (
        <Flex flexDirection="column" alignItems="center">
            <Text fontWeight="bold">Zahlung wird verarbeitet</Text>
            <Box h="2" />
            <Spinner />
            <Box h="2" />
        </Flex>
    );
};

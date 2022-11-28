import {
    Flex,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader
} from "@chakra-ui/react";
import { useContext } from "react";
import {
    PaymentModalContext,
    PaymentModalContextProvider,
    STEPS
} from "./context/PaymentModalContext";
import { PaymentConfirmation } from "./PaymentConfirmation";
import { PaymentOverview } from "./PaymentOverview";

export const PaymentModal = (props: {
    name: string;
    amount: number;
    token: string;
    currency: string;
    receiver: string;
}) => {
    return (
        <ModalContent maxW="800">
            <ModalHeader>Neue Zahlung</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <PaymentModalContextProvider {...props}>
                    <Content />
                </PaymentModalContextProvider>
            </ModalBody>
        </ModalContent>
    );
};
const Content = () => {
    const { steps } = useContext(PaymentModalContext);

    return (
        <Flex direction="column">
            {steps === STEPS.Overview && <PaymentOverview  />}
            {steps === STEPS.Confirmation && <PaymentConfirmation />}
        </Flex>
    );
};

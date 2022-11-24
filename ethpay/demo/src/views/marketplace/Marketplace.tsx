import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "../../components/ConnectButton";
import { Header } from "../../components/Header/Header";
import { MERCHANT_ADDRESS } from "../../constants";
import { ModalContext, MODAL_TYPE } from "../../context/ModalContext";
import { PaymentContext } from "../../context/PaymentContext";
import { useTokenInfomation } from "../../hooks/useTokenInfomation";
import { ListItem } from "./ListItem";

export const MarketPlace = () => {
    const { address } = useAccount();
    const { openModal } = useContext(ModalContext);
    const { makeUsdcPayment } = useContext(PaymentContext);

    const makePaymnet = async () => {
        /*    const usdc = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
        const amount = ethers.utils.parseUnits("0.01", 6).toHexString();
        const receiver = "0x7BC910fd07Be5dD2C00E59452B4940F623068E47";

        const res = await new HttpClient().sendPayment(
            address as string,
            usdc,
            receiver,
            amount
        ); */

        const res = await makeUsdcPayment(
            address as string,
            0.01,
            "0x7BC910fd07Be5dD2C00E59452B4940F623068E47"
        );
    };

    return (
        <Box>
            <Header />
            <Box px="2">
                <Heading>Shop</Heading>
                <Text>
                    Wilkommen auf diesem kleinen Beispielshop. Hier können Sie
                    Gegenstände mit einer Kryptowährung Ihrer Wahl erwerben{" "}
                </Text>
            </Box>
            <Box h="12" />
            <Box w="1200px" px="4">
                <ListItem
                    price={"0.1 USDC"}
                    name="Item 1"
                    currency="USDC"
                    onBuy={() => {
                        openModal(MODAL_TYPE.PAYMENT_MODAL, {
                            name: "Item 1",
                            amount: 0.01,
                            token: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                            currency: "USDC",
                            receiver: MERCHANT_ADDRESS,
                        });
                    }}
                />
            </Box>
        </Box>
    );
};

import { Box, Heading, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { MERCHANT_ADDRESS } from "../../constants";
import { ModalContext, MODAL_TYPE } from "../../context/ModalContext";
import { ListItem } from "./ListItem";

export const MarketPlace = () => {
    const { openModal } = useContext(ModalContext);

    return (
        <Box pt="6" px="12">
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
                    price={"0.01 USDC"}
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

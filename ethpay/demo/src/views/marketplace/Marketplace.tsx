import { Box, Button, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useContext, useState } from "react";
import { useAccount } from "wagmi";
import { HttpClient } from "../../client/HttpClient";
import { ConnectButton } from "../../components/ConnectButton";
import { PaymentContext } from "../../context/PaymentContext";

export const MarketPlace = () => {
    const { address } = useAccount();
    const [res, setres] = useState("nuedee");

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

        setres(res);
    };

    return (
        <Box>
            <ConnectButton />
            <Button onClick={() => makePaymnet()}>Make payment</Button>
            <Text>{JSON.stringify(res)}</Text>
        </Box>
    );
};

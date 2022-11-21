import { Box, Button } from "@chakra-ui/react";
import { useEffect } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { HttpClient } from "../../client/HttpClient";
import { ConnectButton } from "../../components/ConnectButton";

const AUTH_MESSAGE = "I accept the Terms of Service of Ethpay";

export const MarketPlace = () => {
    const { signMessage, data } = useSignMessage({
        message: AUTH_MESSAGE,
    });

    const { address } = useAccount();

    useEffect(() => {
        const login = async () => {
            console.log(data);
            if (!data) {
                throw Error("can't sing ");
            }
            const token = await new HttpClient().login(
                address as string,
                data!
            );
            console.log(token);
        };
        if (!data) {
            return;
        }
        login();
    }, [data, address,]);

    return (
        <Box>
            <ConnectButton />
            <Button onClick={() => signMessage()}>SignMsg</Button>
        </Box>
    );
};

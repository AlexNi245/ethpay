import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { useSignMessage, useAccount } from "wagmi";
import { AuthContext } from "../../context/AuthContext";
import {
    PerspectiveContext,
    Perspectives,
} from "../../context/PerspectiveContext";

const AUTH_MESSAGE = "I accept the Terms of Service of Ethpay";

export const Login = () => {
    const { login } = useContext(AuthContext);
    const { setCurrentPerspective } = useContext(PerspectiveContext);
    const { signMessage, data } = useSignMessage({
        message: AUTH_MESSAGE,
    });

    const { address } = useAccount();

    useEffect(() => {
        const onLogin = async () => {
            if (!data) {
                return;
            }
            await login(address as string, data!);
            setCurrentPerspective(Perspectives.USER);
        };
        onLogin();
    }, [data, login, address, setCurrentPerspective]);

    return (
        <Box pt="6" px="12">
            <Heading>Login</Heading>

            <Box>
                <Text>
                    Um den Nutzer anzumelden, muss dieser eine Nachricht mit dem
                    privaten Schlüssel seiner Metamask Wallet signieren. Das
                    Backend kann anschließend überprüfen, ob die Nachricht
                    tatsächlich von dieser Adresse signier wurde. Damit kann
                    eine Authentifizierung ohne 3. Anbieter nur auf Basis von
                    Public Key Kryptografie realisiert werden.
                </Text>

                <Box pt="8" pb="2">
                    <Button bg="green.300" onClick={() => signMessage()}>
                        Login with Ethereum
                    </Button>
                </Box>
                <Text fontWeight="bold">
                    Die aktuell mit MetaMask verbundene Adresse ist noch nicht
                    angemeldet.
                </Text>
            </Box>
        </Box>
    );
};

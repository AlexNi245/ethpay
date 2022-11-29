import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { useSignMessage, useAccount } from "wagmi";
import { AuthContext } from "../../context/AuthContext";
import {
    PerspectiveContext,
    Perspectives,
} from "../../context/PerspectiveContext";
import { ConnectButton as WagmiConnectButton } from "@rainbow-me/rainbowkit";

const AUTH_MESSAGE = "I accept the Terms of Service of Ethpay";

export const Login = () => {
    const { login } = useContext(AuthContext);
    const { setCurrentPerspective } = useContext(PerspectiveContext);
    const { signMessage, data } = useSignMessage({
        message: AUTH_MESSAGE,
    });

    const { address } = useAccount();
    const { isConnected } = useAccount();

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
                <Box>
                    <Text>
                        Um den Nutzer anzumelden, muss dieser eine Nachricht mit
                        dem privaten Schlüssel seiner Metamask Wallet signieren.
                    </Text>
                    <Text>
                        Das Backend kann anschließend überprüfen, ob die
                        Nachricht tatsächlich von dieser Adresse signiert wurde.
                    </Text>
                    <Text>
                        Damit kann eine Authentifizierung ohne 3. Anbieter nur
                        auf Basis von Public Key Kryptografie realisiert werden.
                    </Text>
                </Box>
                <Text></Text>

                <Box pt="12" pb="6">
                    {isConnected ? (
                        <Button bg="green.300" onClick={() => signMessage()}>
                            Login with Ethereum
                        </Button>
                    ) : (
                        <WagmiConnectButton />
                    )}
                </Box>
                <Text fontWeight="bold">
                    Die aktuell mit MetaMask verbundene Adresse ist noch nicht
                    angemeldet.
                </Text>
            </Box>
        </Box>
    );
};

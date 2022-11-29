import { ChakraProvider, extendTheme, Flex } from "@chakra-ui/react";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { useEffect, useState } from "react";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { AccessWrapper } from "./AccessWrapper";
import { AuthContextProvider } from "./context/AuthContext";
import { ModalContextProvider } from "./context/ModalContext";
import { PaymentContextProvider } from "./context/PaymentContext";
import { PerspectiveContextProvider } from "./context/PerspectiveContext";
import { Database } from "./storage/Database";
import { Perspective } from "./views/Perspective/Perspective";
import { Sidebar } from "./views/Sidebar";

export const App = () => {
    const [hasAccess, setHasAccess] = useState(new Database().checkAccess());

    const { chains, provider } = configureChains(
        [chain.polygon],
        [publicProvider()]
    );

    const { connectors } = getDefaultWallets({
        appName: "Eth Pay demo",
        chains,
    });

    const wagmiClient = createClient({
        autoConnect: true,
        connectors,
        provider,
    });

    const MainView = () => (
        <Flex minH="100vh" h="100%">
            <Sidebar />
            <Perspective />
        </Flex>
    );

    const ethPayTheme = extendTheme({
        components: {
            Text: {
                baseStyle: (_: any) => ({
                    //color: "yellow",
                    padding: 0,
                    margin: 0,
                    fontSize: "18px",
                }),
            },
        },
        styles: {
            global: (_: any) => ({
                body: {
                    height: "100%",
                },
            }),
        },
    });

    return (
        <ChakraProvider theme={ethPayTheme}>
            <WagmiConfig client={wagmiClient}>
                <RainbowKitProvider chains={chains}>
                    <AuthContextProvider>
                        <PerspectiveContextProvider>
                            <PaymentContextProvider>
                                <ModalContextProvider>
                                    {hasAccess ? (
                                        <MainView />
                                    ) : (
                                        <AccessWrapper
                                            onUnlock={() => setHasAccess(true)}
                                        />
                                    )}
                                </ModalContextProvider>
                            </PaymentContextProvider>
                        </PerspectiveContextProvider>
                    </AuthContextProvider>
                </RainbowKitProvider>
            </WagmiConfig>
        </ChakraProvider>
    );
};

import {
    Box,
    ChakraProvider,
    extendTheme,
    Flex,
    theme,
} from "@chakra-ui/react";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { MarketPlace } from "./views/Marketplace/Marketplace";
import "@rainbow-me/rainbowkit/styles.css";
import { Sidebar } from "./views/Sidebar";
import { Perspective } from "./views/Perspective/Perspective";
import { AuthContextProvider } from "./context/AuthContext";
import { CurrentPerspective } from "./views/Perspective/CurrentPerspective";
import { PerspectiveContextProvider } from "./context/PerspectiveContext";

export const App = () => {
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
                            <MainView />
                        </PerspectiveContextProvider>
                    </AuthContextProvider>
                </RainbowKitProvider>
            </WagmiConfig>
        </ChakraProvider>
    );
};

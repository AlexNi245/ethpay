import { Box, ChakraProvider, theme } from "@chakra-ui/react";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { MarketPlace } from "./views/marketplace/Marketplace";
import '@rainbow-me/rainbowkit/styles.css';

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

    return (
        <ChakraProvider theme={theme}>
            <WagmiConfig client={wagmiClient}>
                <RainbowKitProvider chains={chains}>
                    <MarketPlace />
                </RainbowKitProvider>
            </WagmiConfig>
        </ChakraProvider>
    );
};


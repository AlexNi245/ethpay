import { Text } from "@chakra-ui/react";
import { useAccount } from "wagmi";

import { ConnectButton as WagmiConnectButton } from "@rainbow-me/rainbowkit";
export const ConnectButton = () => {
    const { isConnected } = useAccount();
    return !isConnected ? <WagmiConnectButton /> : <Text>Connected</Text>;
};

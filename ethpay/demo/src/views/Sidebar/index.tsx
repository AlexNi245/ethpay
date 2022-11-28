import { QuestionIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, Select, Text, Tooltip } from "@chakra-ui/react";
import { useContext } from "react";
import { useAccount } from "wagmi";
import { AllowanceTile } from "../../components/Header/AllowanceTile";
import {
    PerspectiveContext,
    Perspectives,
} from "../../context/PerspectiveContext";
import { useTokenInfomation } from "../../hooks/useTokenInfomation";
import { Explanation } from "./Explanation";
import { RoleSwitch } from "./RoleSwitch";

export const Sidebar = () => {
    const { address } = useAccount();

    const { currentPerspective } = useContext(PerspectiveContext);
    const { balances, allowances } = useTokenInfomation(address as string);

    return (
        <Flex
            direction="column"
            justifyContent="space-between"
            minH="100vh"
            h="100%"
            maxW="300"
            bgColor={
                currentPerspective === Perspectives.MERCHANT
                    ? "yellow.200"
                    : "red.200"
            }
        >
            <Box pt="6" px="2">
                <RoleSwitch />
                <Box h="12" />
                <Flex flexDirection="column">
                    <Flex justifyContent="space-between">
                        <Heading size="md" fontWeight="bold">
                            Connected Address
                        </Heading>
                        <Tooltip label="Diese Adresse ist gerade mit MetaMask verbundenƒ">
                            <QuestionIcon />
                        </Tooltip>
                    </Flex>
                    <Box h="2" />

                    <Text>{address}</Text>
                </Flex>
                <Box h="6" />
                {currentPerspective === Perspectives.USER && (
                    <Flex flexDirection="column">
                        <Flex justifyContent="space-between">
                            <Heading size="md" fontWeight="bold">
                                Guthaben
                            </Heading>
                            <Tooltip label="Das Guthaben der verbunden Adresse für alle unterstützen ERC-20 Token">
                                <QuestionIcon />
                            </Tooltip>
                        </Flex>
                        <Box h="2" />

                        <AllowanceTile
                            allowance={allowances[0]}
                            balance={balances[0]}
                            name="wMatic"
                        />
                        <Box w="4" />
                        <AllowanceTile
                            allowance={allowances[1]}
                            balance={balances[1]}
                            name="wBtc"
                        />
                        <Box w="4" />
                        <AllowanceTile
                            allowance={allowances[2]}
                            balance={balances[2]}
                            name="USDC"
                        />
                    </Flex>
                )}
            </Box>
            <Flex flexDirection="column" justifyContent="end" h="100%">
                <Box px="2">
                    <Heading size="md" fontWeight="bold">
                        Erklärung
                    </Heading>
                    <Box h="2" />
                    <Box px="2">
                        <Explanation />
                    </Box>
                </Box>
                <Box h="6" />
            </Flex>
        </Flex>
    );
};

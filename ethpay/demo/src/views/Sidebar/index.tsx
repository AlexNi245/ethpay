import { QuestionIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, Select, Text, Tooltip } from "@chakra-ui/react";
import { useContext } from "react";
import { useAccount } from "wagmi";
import { PerspectiveContext, Perspectives } from "../../context/PerspectiveContext";
import { Explanation } from "./Explanation";
import { RoleSwitch } from "./RoleSwitch";

export const Sidebar = () => {
    const { address } = useAccount();

    const {currentPerspective} = useContext(PerspectiveContext)
    return (
        <Flex
            direction="column"
            justifyContent="space-between"
            minH="100vh"
            h="100%"
            minW="200px"
            bgColor={currentPerspective ===Perspectives.MERCHANT ? "yellow.200" : "red.200"}
        >
            <Box pt="6" px="2">
                <RoleSwitch />
                <Box h="6" />
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
            </Box>
            <Flex flexDirection="column" justifyContent="end" h="100%">
                <Box px="2">
                    <Explanation />
                </Box>
                <Box h="6" />
            </Flex>
        </Flex>
    );
};

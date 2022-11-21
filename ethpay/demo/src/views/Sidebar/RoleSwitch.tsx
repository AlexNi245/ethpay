import { QuestionIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, Select, Text, Tooltip } from "@chakra-ui/react";
import { useContext } from "react";
import {
    PerspectiveContext,
    Perspectives,
} from "../../context/PerspectiveContext";

export const RoleSwitch = () => {
    const { setCurrentPerspective } = useContext(PerspectiveContext);

    const onSwitch = () => {};
    return (
        <Box>
            <Flex justifyContent="space-between">
                <Heading size="md" fontWeight="bold">
                    Rolle
                </Heading>
                <Tooltip label="In dem Sie eine andere Rolle wählen, können Sie zwischen den verschiedenen Nutzern der App wechseln">
                    <QuestionIcon />
                </Tooltip>
            </Flex>
            <Box h="2" />
            <Select
                size="lg"
                onChange={(e) =>
                    setCurrentPerspective(
                        Number.parseInt(
                            e.target.value
                        ) as unknown as Perspectives
                    )
                }
            >
                <option value={Perspectives.USER}>User</option>
                <option value={Perspectives.MERCHANT}>Merchant</option>
            </Select>
            <Text fontSize="sm"> </Text>
        </Box>
    );
};

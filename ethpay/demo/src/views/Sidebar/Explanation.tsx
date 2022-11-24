import { Box, Text } from "@chakra-ui/react";
import { useContext } from "react";
import {
    PerspectiveContext,
    Perspectives,
} from "../../context/PerspectiveContext";

export const Explanation = () => {
    const { currentPerspective } = useContext(PerspectiveContext);

    const UserExplanation = "user blablabla";
    const MerchantExplanation = "Merchant blablabla";

    if (currentPerspective === Perspectives.LOGIN) {
        return <Box></Box>;
    }

    if (currentPerspective === Perspectives.USER) {
        return <Text>{UserExplanation}</Text>;
    }

    return <Text>{MerchantExplanation}</Text>;
};

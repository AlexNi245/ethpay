import { Flex } from "@chakra-ui/react";
import { useContext } from "react";
import {
    PerspectiveContext,
    Perspectives
} from "../../context/PerspectiveContext";
import { Login } from "../Login/Login";
import { MarketPlace } from "../Marketplace/Marketplace";
import { Merchant } from "../Merchant/Merchant";

export const Perspective = () => {
    const { currentPerspective } = useContext(PerspectiveContext);

    

    const getPerspective = () => {
        switch (currentPerspective) {
            case Perspectives.MERCHANT:
                return <Merchant />;
            case Perspectives.USER:
                return <MarketPlace />;
            default:
                return <Login />;
        }
    };

    return (
        <Flex flexDirection="column" w="100%">
            {getPerspective()}
        </Flex>
    );
};

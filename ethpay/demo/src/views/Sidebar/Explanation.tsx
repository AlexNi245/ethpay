import { Box, Text } from "@chakra-ui/react";
import { useContext } from "react";
import {
    PerspectiveContext,
    Perspectives,
} from "../../context/PerspectiveContext";

export const Explanation = () => {
    const { currentPerspective } = useContext(PerspectiveContext);

    const UserExplanation = (
        <Box>
            <Text>Als User können Sie fiktive Items erwerben </Text>
            <Text>
                Bezahlt werden können diese mit diversen Kryptowährungen.
            </Text>
            <Text>
                Die Zahlung wird dabei durch den Zahlungsverarbeiter getätigt.
            </Text>
            <Text>
                Sobald eine Zahlung abgeschlossen wurde, finden Sie diese in der Payment Übersicht des Händlers.
            </Text>
        </Box>
    );
    const LoginExplanation = (
        <Box>
            <Text fontWeight="bold">Herlich Willkommen !</Text>
            <Text>
                Login With Ethereum nutzt die Möglichkeit Ihrer Wallet
                Nachrichten mit dem privaten Schlüssel zu signieren.
            </Text>
            <Text>
                Diese Signatur wird als Token für den Zahlungsanbieter und den
                Onlineshop benutzt.{" "}
            </Text>
        </Box>
    );
    const MerchantExplanation = (
        <Box>
            <Text>
                In der Verkäufer Ansicht können Sie alle aktuellen Guthaben des
                Verkäufers sehen.
            </Text>
            <Text>
                Das Guthaben des Verkäufers wird erhöht, wenn der Käufer ein
                Item kauft.
            </Text>
            <Text>
                Alle vergangenen Payments werden außerdem in der Payments
                Tabelle angezeigt.
            </Text>
        </Box>
    );

    if (currentPerspective === Perspectives.LOGIN) {
        return LoginExplanation;
    }

    if (currentPerspective === Perspectives.USER) {
        return UserExplanation;
    }

    return MerchantExplanation;
};

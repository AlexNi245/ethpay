import {
    Box,
    Button,
    Flex,
    FormControl,
    FormHelperText,
    FormLabel,
    Heading,
    Input,
    Text,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useState } from "react";
import { Database } from "./storage/Database";

export const AccessWrapper = ({ onUnlock }: { onUnlock: () => void }) => {
    const [pw, setpw] = useState("AqDWUBlsZOLb5i");

    const handleInputChange = (e: any) => setpw(e.target.value);

    const onclick = () => {
        const expectedPwHash =
            "0xbb23d10074e654524456b1b7359ba5b45e95ac3fef5b55b270020585f463dbde";

        const actualpwHash = ethers.utils.keccak256(
            ethers.utils.toUtf8Bytes(pw)
        );
        if (expectedPwHash === actualpwHash) {
            new Database().addAccess()
            onUnlock();
        }
    };

    return (
        <Flex h="100vh" justifyContent="center" alignItems="center">
            <Box maxW="700" bg="green.200" p="12" borderRadius="12">
                <Heading fontWeight="bold">Hallo Herr Zschiegner </Heading>
                <Box h="6" />
                <Text>
                    Herzlich Willkommen zu der Demo des Payment Providers
                    welcher in meiner Bachelor Thesis entwickelt wurde.
                </Text>
                <Box h="1" />
                <Text>
                    Sie finden hier einen fiktiven Onlineshop auf dem
                    Gegenstände mit Kryptowährungen gekauft werden können.
                </Text>
                <Box h="1" />
                <Text>
                    Das Besondere an diesem Shop ist, dass die Zahlungen über
                    den in meiner Arbeit entwickelten Payment Provider
                    durchgeführt werden.
                </Text>
                <Box h="1" />
                <Text>
                    Sie können in den Sidebar zwischen den Rollen Käufer und
                    Verkäufer wählen und so zwischen den beiden Akteuren
                    wechseln.
                </Text>
                <Box h="8" />

                <FormControl onChange={handleInputChange}>
                    <FormLabel>Password</FormLabel>
                    <Input bg="white" type="password" />
                    <Box h="1" />
                    <FormHelperText>
                        Bitte geben Sie das Passwort aus der E-Mail ein.
                    </FormHelperText>
                    <Box h="6" />
                </FormControl>
                <Button onClick={onclick}>Anmelden</Button>
            </Box>
        </Flex>
    );
};

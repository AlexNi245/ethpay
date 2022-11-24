import { Grid, GridItem, Text } from "@chakra-ui/react";

export const PaymentTile = ({
    sender,
    receiver,
    amount,
    token,
    txHash,
    createdAt,
}: {
    sender: string;
    receiver: string;
    amount: string;
    token: string;
    txHash: string;
    createdAt: Date;
}) => {
 

    const formatAddr = (addr: string) =>
        `${addr.substring(0, 6)}...${addr.slice(-6)}`;
    return (
        <Grid templateColumns="repeat(6, 1fr)" gap={6}>
            <GridItem>
                <Text>{formatAddr(sender)}</Text>
            </GridItem>
            <GridItem>
                <Text>{formatAddr(receiver)}</Text>
            </GridItem>
            <GridItem>
                <Text>{amount}</Text>
            </GridItem>
            <GridItem>
                <Text>USDC</Text>
            </GridItem>
            <GridItem>
                <Text>
                    {createdAt.toLocaleDateString() +
                        "-" +
                        createdAt.toLocaleTimeString()}
                </Text>
            </GridItem>
            <GridItem>
                <Text> {txHash}</Text>
            </GridItem>
        </Grid>
    );
};

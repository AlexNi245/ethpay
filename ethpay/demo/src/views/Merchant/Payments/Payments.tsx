import { Box, Flex, Grid, GridItem, Link } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { HttpClient } from "../../../client/HttpClient";
import { Database, PaymentDto } from "../../../storage/Database";
import { formatAmount } from "../../../utils/formatAmount";
import { PaymentTile } from "./PaymentTile";

export const Payments = () => {
    const [payments, setpayments] = useState<any[]>([]);

    const formatAddr = (addr: string) =>
        `${addr.substring(0, 6)}...${addr.slice(-6)}`;

    const formatTxHash = (txhash: string) => {
        const url = `https://polygonscan.com/tx/${txhash}`;

        return <Link textColor="blue" isExternal href={url}>{formatAddr(txhash)}</Link>;
    };

    useEffect(() => {
        const payments = new Database().getItems();

        const fetchPayments = async () => {
            const resolved = await Promise.all(
                payments.map(async (p: PaymentDto) => {
                    const resovledPayment =
                        await new HttpClient().getPaymentById(p.id);

                    return {
                        sender: resovledPayment.senderAddress,
                        receiver: resovledPayment.receiverAddress,
                        amount: formatAmount(
                            resovledPayment.Amount,
                            resovledPayment.Token
                        ),
                        token: resovledPayment.Token,
                        txHash: formatTxHash(resovledPayment.txHash),
                        createdAt: new Date(p.createdAt),
                    };
                })
            );
            setpayments(resolved);
            console.log(resolved);
        };

        fetchPayments();
    }, []);
    return (
        <Box >
            <Grid templateColumns="repeat(6, 1fr)" gap={6}>
                <GridItem fontWeight="bold">Sender</GridItem>
                <GridItem fontWeight="bold">Empfänger</GridItem>
                <GridItem fontWeight="bold">Menge</GridItem>
                <GridItem fontWeight="bold">Token</GridItem>
                <GridItem fontWeight="bold">Erstellungsdatum</GridItem>
                <GridItem fontWeight="bold">Transaktion in Blockexplorer anzeigen</GridItem>
            </Grid>
            {payments.map((p) => (
                <PaymentTile {...p} />
            ))}
        </Box>
    );
};

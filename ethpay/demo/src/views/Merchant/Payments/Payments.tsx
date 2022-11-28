import { Box, Flex, Grid, GridItem } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { HttpClient } from "../../../client/HttpClient";
import { Database, PaymentDto } from "../../../storage/Database";
import { formatAmount } from "../../../utils/formatAmount";
import { PaymentTile } from "./PaymentTile";

export const Payments = () => {
    const [payments, setpayments] = useState<any[]>([]);

    useEffect(() => {
        const payments = new Database().getItems();

        const fetchPayments = async () => {
            const resolved = await Promise.all(
                payments.map(async (p: PaymentDto) => {
                    const resovledPayment =
                        await new HttpClient().getPaymentById(p.id);

                        console.log(resovledPayment)
                    return {
                        sender: resovledPayment.senderAddress,
                        receiver: resovledPayment.receiverAddress,
                        amount: formatAmount(
                            resovledPayment.Amount,
                            resovledPayment.Token
                        ),
                        token: resovledPayment.Token,
                        txHash: "TBD",
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
                <GridItem fontWeight="bold">Transaction Hash</GridItem>
            </Grid>
            {payments.map((p) => (
                <PaymentTile {...p} />
            ))}
        </Box>
    );
};

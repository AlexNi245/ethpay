import { PrismaClient } from "@prisma/client";
import { BigNumber } from "ethers";
import express from "express";
import { AuthService } from "../service/AuthService";
import { GatewayService } from "../service/GatewayService";
import { AddPaymentResult, PaymentService } from "../service/PaymentService";

export const paymentResource = (
    db: PrismaClient,
    gatewayService: GatewayService
) => {
    const app = express();
    app.use(require("body-parser").json());

    app.get("/all", async (req: express.Request, res: express.Response) => {
        const authToken = req.headers.authorization;

        const address = new AuthService(db).getAddress(authToken ?? "");
        if (!address) {
            return res.status(401).send();
        }
        const paymentService = new PaymentService(db, gatewayService);
        const payments = await paymentService.getPayments(address);

        return res.status(200).send(payments);
    });
    app.get("/id/:id", async (req: express.Request, res: express.Response) => {
        const { id } = req.params;

        if (isNaN(Number.parseInt(id))) {
            return res.send(404);
        }

        const paymentService = new PaymentService(db, gatewayService);
        const payment = await paymentService.getPaymentById(id);

        if (!payment) {
            return res.status(404).send();
        }

        return res.status(200).send({ payment });
    });

    app.post("/", async (req: express.Request, res: express.Response) => {
        try {
            const authToken = req.headers.authorization;
            const { receiver, amount, token } = req.body;

            const address = new AuthService(db).getAddress(authToken ?? "");
            if (!address) {
                return res.status(401).send();
            }

            const paymentService = new PaymentService(db, gatewayService);
            const { result, payload } = await paymentService.addPayment(
                token,
                address,
                receiver,
                BigNumber.from(amount)
            );

            console.log("RES", result);

            if (result === AddPaymentResult.UNSUPPORTED) {
                return res.status(400).send({ error: "Unsupported Token" });
            }

            if (result === AddPaymentResult.INSUFFICIENT_ALLOWANCE) {
                return res
                    .status(400)
                    .send({ error: "Insufficient Allowance" });
            }
            if (result === AddPaymentResult.INSUFFICIENT_BALANCE) {
                return res.status(400).send({ error: "Insufficient Balance" });
            }

            if (result === AddPaymentResult.FAILURE) {
                return res.status(400).send({ error: "Payment failed" });
            }

            return res.status(200).send({ id: payload });
        } catch (e) {
            console.log(e);
        }
    });

    return app;
};

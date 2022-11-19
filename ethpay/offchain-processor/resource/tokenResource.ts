import { PrismaClient } from "@prisma/client";
import { Signer } from "ethers";
import express from "express";
import { ethers } from "hardhat";
import { GatewayRegistry } from "../../typechain";
import { GatewayService } from "../service/GatewayService";

export const tokenResource = (
    db: PrismaClient,
    gatewayRegistry: GatewayRegistry,
    onchainProcessor: Signer
) => {
    const app = express();
    app.use(require("body-parser").json());

    app.get(
        "/all",
        async (req: express.Request, res: express.Response) => {
            const allTokens = await new GatewayService(
                gatewayRegistry,
                onchainProcessor
            ).getAllTokens();

            return res.status(200).send(allTokens);
        }
    );
    app.get(
        "/getAllowance/:token/:user",
        async (req: express.Request, res: express.Response) => {
            const { token, user } = req.params;
            if (
                !ethers.utils.isAddress(token) ||
                !ethers.utils.isAddress(user)
            ) {
                return res.status(400).send();
            }

            const gatewayService = new GatewayService(
                gatewayRegistry,
                onchainProcessor
            );

            const allTokens = await gatewayService.getAllTokens();

            const isSupported = !!allTokens
                .map((t) => t.address)
                .find(
                    (t) =>
                        ethers.utils.getAddress(t) ===
                        ethers.utils.getAddress(token)
                );

            if (!isSupported) {
                return res.status(400).send({ error: "Unsupported Token" });
            }

            const allowance = await gatewayService.getAllowance(token, user);

            return res.status(200).send(allowance);
        }
    );

    return app;
};

import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { loginResource } from "./resource/loginResource";
import { PrismaClient } from "@prisma/client";
import { paymentResource } from "./resource/paymentResource";
import { tokenResource } from "./resource/tokenResource";
import { ethers } from "hardhat";
import { GatewayService } from "./service/GatewayService";
import { Wallet } from "ethers";
import { GatewayRegistry } from "../typechain";

dotenv.config();
export const main = async () => {

    const app: Express = express();
    const port = 3010;

    const db = new PrismaClient();

    const { REGISTRY_ADDRESS, ONCHAIN_PROCESSOR_PRIVATE_KEY } = process.env;

    if (!REGISTRY_ADDRESS) {
        throw "Undefined registry";
    }

    if (!ONCHAIN_PROCESSOR_PRIVATE_KEY) {
        throw "Undefined onchain processor";
    }

    const gatewayRegistry = (
        await ethers.getContractFactory("GatewayRegistry")
    ).attach(REGISTRY_ADDRESS) as GatewayRegistry;

    const onchainProcessor = new Wallet(ONCHAIN_PROCESSOR_PRIVATE_KEY);

    app.use("/login", loginResource(db));
    app.use(
        "/payment",
        paymentResource(
            db,
            new GatewayService(gatewayRegistry, onchainProcessor)
        )
    );
    app.use("/token", tokenResource(db, gatewayRegistry, onchainProcessor));

    app.listen(port, () => {
        console.log(
            `⚡️[server]: Server is running at https://localhost:${port}`
        );
    });
};
main();

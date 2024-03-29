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
import cors from "cors";
import fs from "fs";
import https from "https";
dotenv.config();

const getCerts = () => {
    var key = fs.readFileSync(__dirname + "/certs/privkey.pem");
    var cert = fs.readFileSync(__dirname + "/certs/fullchain.pem");
    var options = {
        key: key,
        cert: cert,
    };

    console.log("read keys", options);

    return options;
};
export const main = async () => {
    const app: Express = express();
    app.use(cors());

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

    const provider = new ethers.providers.JsonRpcProvider(
        "https://polygon-rpc.com"
    );

    const onchainProcessor = new Wallet(
        ONCHAIN_PROCESSOR_PRIVATE_KEY,
        provider
    );



    app.use("/login", loginResource(db));
    app.use(
        "/payment",
        paymentResource(
            db,
            new GatewayService(gatewayRegistry, onchainProcessor)
        )
    );
    app.use("/token", tokenResource(db, gatewayRegistry, onchainProcessor));

    var server = https.createServer(getCerts(), app);

    server.listen(port, () => {
        console.log(
            `⚡️[server]: Server is running at http://localhost:${port}`
        );
    });
};
main();

import { PrismaClient } from "@prisma/client";
import express from "express";
import { ethers } from "hardhat";
import { AuthService } from "./../service/AuthService";

export const authResource = (db: PrismaClient) => {
    const app = express();
    app.use(require("body-parser").json());

    app.post("/login", async (req: express.Request, res: express.Response) => {
        const {
            address,
            messageSignature,
        }: { address: string; messageSignature: string } = req.body;

        if (!ethers.utils.isAddress(address)) {
            return res.status(400).send({ error: "invalid address" });
        }

        const jwtString =await new AuthService(db).login(address, messageSignature);

        if (!jwtString) {
            return res.status(400).send({ error: "invalid signature" });
        }

        return res.status(200).send({ jwt: jwtString });
    });

    return app;
};

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { PrismaClient } from "@prisma/client";
import { expect } from "chai";
import { ethers } from "hardhat";
import sinon from "sinon";
import { AuthService } from "./../../../offchain-processor/service/AuthService";
import * as jwt from "jsonwebtoken";

describe.only("AuthServiceTest", () => {
    const sandBox = sinon.createSandbox();
    let user: SignerWithAddress;

    beforeEach(async () => {
        [user] = await ethers.getSigners();
    });
    afterEach(async () => {
        await new PrismaClient().user.deleteMany()
        await new PrismaClient().payments.deleteMany()
        sandBox.restore();
    });

    it("login -- User can sign in with valid signature", async () => {
        const database = new PrismaClient();

        const authService = new AuthService(database);

        const addresss = user.address;
        const messageSignature = await user.signMessage(
            AuthService.AuthMessage
        );

        const jwtToken = await authService.login(addresss, messageSignature);

        const session = database.user.findFirstOrThrow({
            where: { messageSignature },
        });
        expect((await session).address).to.equal(addresss);
        expect(jwtToken).to.not.be.null;
    });
    it("login -- Fails if signature is invalid", async () => {
        const database = new PrismaClient();

        const authService = new AuthService(database);

        const addresss = user.address;
        const messageSignature = await user.signMessage("invalid message");

        const jwtToken = await authService.login(addresss, messageSignature);

        const session = await database.user.findFirst({
            where: { messageSignature },
        });
        console.log(session);
        expect(session).to.equal(null);
    });
});
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { PrismaClient } from "@prisma/client";
import { expect } from "chai";
import { ethers } from "hardhat";
import sinon from "sinon";
import { AuthService } from "../../../offchain-processor/service/AuthService";

describe("AuthServiceTest", () => {
    const sandBox = sinon.createSandbox();
    let user: SignerWithAddress;

    beforeEach(async () => {
        [user] = await ethers.getSigners();
    });
    afterEach(async () => {
        await new PrismaClient().user.deleteMany();
        await new PrismaClient().payments.deleteMany();
        sandBox.restore();
    });

    it("ID8: login -- User can sign in with valid signature", async () => {
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
    it("ID9: login -- Fails if signature is invalid", async () => {
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
    it("ID10: isLoggedIn -- Returns false if user is not logged in", async () => {
        const database = new PrismaClient();

        const authService = new AuthService(database);

        const addresss = user.address;

        const isLoggedIn = await authService.isLoggedIn(addresss);
        expect(isLoggedIn).to.equal(false);
    });
    it("ID11: isLoggedIn -- Returns true if user is logged in ", async () => {
        const database = new PrismaClient();

        const authService = new AuthService(database);

        const addresss = user.address;
        const messageSignature = await user.signMessage(
            AuthService.AuthMessage
        );

        await authService.login(addresss, messageSignature);

        const isLoggedIn = await authService.isLoggedIn(addresss);
        expect(isLoggedIn).to.equal(true);
    });
});

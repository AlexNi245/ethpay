import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { PrismaClient } from "@prisma/client";
import { ethers } from "hardhat";
import { AuthService } from "./../../../offchain-processor/service/AuthService";
import sinon from "sinon";

import chai = require("chai");
import chaiAsPromised = require("chai-as-promised");
import chaiHttp = require("chai-http");
import chaiString = require("chai-string");
import { expect } from "chai";
import { authResource } from "./../../../offchain-processor/resource/authResource";

chai.use(chaiAsPromised);
chai.use(chaiHttp);
chai.use(chaiString);

chai.should();

describe.only("Auth Test", () => {
    const sandBox = sinon.createSandbox();
    let user: SignerWithAddress;
    let rando: SignerWithAddress;

    beforeEach(async () => {
        [user, rando] = await ethers.getSigners();
    });
    afterEach(async () => {
        await new PrismaClient().user.deleteMany();
        await new PrismaClient().payments.deleteMany();
        sandBox.restore();
    });
    it("retuns 400 if address is not valid", async () => {
        const db = new PrismaClient();

        const messageSignature = await user.signMessage(
            AuthService.AuthMessage
        );

        const body = {
            address: "ddd",
            messageSignature,
        };
        const res = await chai
            .request(authResource(db))
            .post("/login")
            .send(body);
        expect(res.status).to.equal(400);
    });
    it("retuns 400 if address not matches signature", async () => {
        const db = new PrismaClient();

        const messageSignature = await rando.signMessage(
            AuthService.AuthMessage
        );

        const body = {
            address: user.address,
            messageSignature,
        };
        const res = await chai
            .request(authResource(db))
            .post("/login")
            .send(body);
        expect(res.status).to.equal(400);
    });
    it("retuns 200 and a jwt token if the address matches the signature", async () => {
        const db = new PrismaClient();

        const messageSignature = await user.signMessage(
            AuthService.AuthMessage
        );

        const body = {
            address: user.address,
            messageSignature,
        };
        const res = await chai
            .request(authResource(db))
            .post("/login")
            .send(body);
        expect(res.status).to.equal(200);
        expect(res.body.jwt).to.not.be.null
    });
});

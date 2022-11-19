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
import { GatewayRegistry, ERC20, Gateway } from "../../../typechain";
import { mockToken, USDC } from "../../contracts/utils/ERC20Utils";
import { tokenResource } from "../../../offchain-processor/resource/tokenResource";

chai.use(chaiAsPromised);
chai.use(chaiHttp);
chai.use(chaiString);

chai.should();

describe("Token Resource", () => {
    const sandBox = sinon.createSandbox();
    let gatewayRegistry: GatewayRegistry;

    let owner: SignerWithAddress;
    let user: SignerWithAddress;

    let onchainProcessor: SignerWithAddress;

    let rando: SignerWithAddress;

    let usdc: ERC20;
    let usdcGateway: Gateway;

    let dai: ERC20;
    let daiGateway: Gateway;

    beforeEach(async () => {
        [owner, user, rando, onchainProcessor] = await ethers.getSigners();

        const gatewayRegistryFactory = await ethers.getContractFactory(
            "GatewayRegistry"
        );

        gatewayRegistry = (await gatewayRegistryFactory.deploy(
            owner.address
        )) as GatewayRegistry;

        usdc = await mockToken("USDC");
        dai = await mockToken("DAI");

        await usdc.connect(owner).transfer(user.address, USDC(10000));

        const gatewayFactory = ethers.getContractFactory("Gateway");
        usdcGateway = (await (
            await gatewayFactory
        ).deploy(onchainProcessor.address, usdc.address)) as Gateway;

        daiGateway = (await (
            await gatewayFactory
        ).deploy(onchainProcessor.address, dai.address)) as Gateway;
    });
    afterEach(async () => {
        await new PrismaClient().user.deleteMany();
        await new PrismaClient().payments.deleteMany();
        sandBox.restore();
    });

    describe("getAllTokens", async () => {
        it("returns all tokens", async () => {
            const db = {} as PrismaClient;
            await gatewayRegistry.addToken(usdc.address, usdcGateway.address);

            const res = await chai
                .request(tokenResource(db, gatewayRegistry, onchainProcessor))
                .get("/getAllTokens")
                .send();
            expect(res.status).to.equal(200);
            console.log(res.body);

            expect(res.body[0].gateway).to.eq(usdcGateway.address);
            expect(res.body[0].address).to.eq(usdc.address);
        });
    });
    describe("getAllowance", async () => {
        it("ID2: returns 400 if token is an invalid ethereum address", async () => {
            const db = {} as PrismaClient;
            await gatewayRegistry.addToken(usdc.address, usdcGateway.address);

            const res = await chai
                .request(tokenResource(db, gatewayRegistry, onchainProcessor))
                .get(`/getAllowance/foo/${user.address}`)
                .send();

            expect(res.status).to.equal(400);
        });
        it("ID3: returns 400 if address is an invalid ethereum address", async () => {
            const db = {} as PrismaClient;
            await gatewayRegistry.addToken(usdc.address, usdcGateway.address);

            const res = await chai
                .request(tokenResource(db, gatewayRegistry, onchainProcessor))
                .get(`/getAllowance/${usdc.address}/foo`)
                .send();

            expect(res.status).to.equal(400);
        });
        it("ID4 returns 400 if token is not supported", async () => {
            const db = {} as PrismaClient;

            const res = await chai
                .request(tokenResource(db, gatewayRegistry, onchainProcessor))
                .get(`/getAllowance/${usdc.address}/${user.address}`)
                .send();

            expect(res.status).to.equal(400);
            expect(res.body.error).to.equal("Unsupported Token");
        });
        it("ID5 returns users allowance for a supported token", async () => {
            const db = {} as PrismaClient;
            await gatewayRegistry.addToken(usdc.address, usdcGateway.address);
            await usdc
                .connect(user)
                .increaseAllowance(usdcGateway.address, USDC(100));

            const res = await chai
                .request(tokenResource(db, gatewayRegistry, onchainProcessor))
                .get(`/getAllowance/${usdc.address}/${user.address}`)
                .send();

            expect(res.status).to.equal(200);
            expect(res.body).to.equal(USDC(100));

            console.log(res.body);
        });
    });
});

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { PrismaClient } from "@prisma/client";
import { ethers } from "hardhat";
import sinon from "sinon";
import { GatewayRegistry, ERC20, Gateway } from "../../../typechain";
import { mockToken, printUSDC, USDC } from "../../contracts/utils/ERC20Utils";
import chai = require("chai");
import chaiAsPromised = require("chai-as-promised");
import chaiHttp = require("chai-http");
import chaiString = require("chai-string");
import { paymentResource } from "../../../offchain-processor/resource/paymentResource";
import { GatewayService } from "../../../offchain-processor/service/GatewayService";
import { expect } from "chai";
import { loginResource } from "../../../offchain-processor/resource/loginResource";
import { AuthService } from "../../../offchain-processor/service/AuthService";
import { clearDb } from "../../contracts/utils/clearDb";

chai.use(chaiAsPromised);
chai.use(chaiHttp);
chai.use(chaiString);

chai.should();

describe("Payment Resource", () => {
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

    let db: PrismaClient;

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

        db = new PrismaClient();
    });
    afterEach(async () => {
        await clearDb();
        sandBox.restore();
    });
    describe("getPayments", () => {
        it("ID9 Returns 401 if address is invalid", async () => {
            await gatewayRegistry.addToken(usdc.address, usdcGateway.address);

            const mockGatewayServer = new GatewayService(
                gatewayRegistry,
                onchainProcessor
            );

            const res = await chai
                .request(paymentResource(db, mockGatewayServer))
                .get(`/all`)
                .set("Authorization", "foo")
                .send();
            expect(res.status).to.equal(401);
        });
        it("ID10 Returns 200 and all the payments a user has made if any", async () => {
            await gatewayRegistry.addToken(usdc.address, usdcGateway.address);
            await usdc
                .connect(user)
                .increaseAllowance(usdcGateway.address, USDC(100));

            const gatewayServer = new GatewayService(
                gatewayRegistry,
                onchainProcessor
            );

            const jwt = await login();

            const createRes = await chai
                .request(paymentResource(db, gatewayServer))
                .post(`/`)
                .set("Authorization", jwt)
                .send({
                    receiver: rando.address,
                    amount: USDC(20),
                    token: usdc.address,
                });
            expect(createRes.status).to.equal(200);

            const id = createRes.body.id;

            console.log(createRes.body);

            const getRes = await chai
                .request(paymentResource(db, gatewayServer))
                .get(`/all`)
                .set("Authorization", jwt)
                .send();

            expect(getRes.status).to.equal(200);
            expect(getRes.body[0].id).to.equal(id);
        });

        describe("get Payment by id", () => {
            it("ID11 returns 404 if payment can't be found", async () => {
                const gatewayServer = new GatewayService(
                    gatewayRegistry,
                    onchainProcessor
                );
                const res = await chai
                    .request(paymentResource(db, gatewayServer))
                    .get(`/id/123`)
                    .send();

                expect(res.status).to.equal(404);
            });
            it("ID12 returns 200 and the payment of an existing payment id", async () => {
                await gatewayRegistry.addToken(
                    usdc.address,
                    usdcGateway.address
                );
                await usdc
                    .connect(user)
                    .increaseAllowance(usdcGateway.address, USDC(100));

                const gatewayServer = new GatewayService(
                    gatewayRegistry,
                    onchainProcessor
                );

                const jwt = await login();

                const createRes = await chai
                    .request(paymentResource(db, gatewayServer))
                    .post(`/`)
                    .set("Authorization", jwt)
                    .send({
                        receiver: rando.address,
                        amount: USDC(20),
                        token: usdc.address,
                    });
                expect(createRes.status).to.equal(200);

                const id = createRes.body.id;
                const res = await chai
                    .request(paymentResource(db, gatewayServer))
                    .get(`/id/${id}`)
                    .send();

                expect(res.status).to.equal(200);
                expect(res.body.payment.id).to.equal(id);
                expect(res.body.payment.receiverAddress).to.equal(
                    rando.address
                );
                expect(res.body.payment.Amount).to.equal(USDC(19.8));
                expect(res.body.payment.Token).to.equal(usdc.address);
                expect(res.body.payment.senderAddress).to.equal(user.address);
            });
        });

        describe("add Payment", () => {
            it("ID13 Returns 200 and the id a payment was successful", async () => {
                await usdc
                    .connect(user)
                    .increaseAllowance(usdcGateway.address, USDC(100));

                const randosPreviousBalance = await usdc.balanceOf(
                    rando.address
                );

                await gatewayRegistry.addToken(
                    usdc.address,
                    usdcGateway.address
                );

                const gatewayServer = new GatewayService(
                    gatewayRegistry,
                    onchainProcessor
                );

                const jwt = await login();

                const createRes = await chai
                    .request(paymentResource(db, gatewayServer))
                    .post(`/`)
                    .set("Authorization", jwt)
                    .send({
                        receiver: rando.address,
                        amount: USDC(20),
                        token: usdc.address,
                    });
                expect(createRes.status).to.equal(200);

                const id = createRes.body.id;

                const getRes = await chai
                    .request(paymentResource(db, gatewayServer))
                    .get(`/all`)
                    .set("Authorization", jwt)
                    .send();

                expect(getRes.status).to.equal(200);
                expect(getRes.body[0].id).to.equal(id);

                const randosAfterPaymentBalance = await usdc.balanceOf(
                    rando.address
                );
                //Randos Balance quals the amount after fee
                expect(randosAfterPaymentBalance).to.equal(
                    randosPreviousBalance.add(USDC(19.8))
                );
            });

            it("ID14 Returns 400 if the senders allowance is insufficient ", async () => {
                await gatewayRegistry.addToken(
                    usdc.address,
                    usdcGateway.address
                );
                const gatewayServer = new GatewayService(
                    gatewayRegistry,
                    onchainProcessor
                );

                const jwt = await login();

                const createRes = await chai
                    .request(paymentResource(db, gatewayServer))
                    .post(`/`)
                    .set("Authorization", jwt)
                    .send({
                        receiver: rando.address,
                        amount: USDC(20),
                        token: usdc.address,
                    });
                expect(createRes.status).to.equal(400);
                expect(createRes.body.error).to.equal("Insufficient Allowance");
            });
            it("ID15 Returns 400 if the senders balance is insufficient ", async () => {
                //Allowance exceed balance
                await usdc
                    .connect(user)
                    .increaseAllowance(usdcGateway.address, USDC(100000));

                await gatewayRegistry.addToken(
                    usdc.address,
                    usdcGateway.address
                );
                const gatewayServer = new GatewayService(
                    gatewayRegistry,
                    onchainProcessor
                );

                const jwt = await login();

                const createRes = await chai
                    .request(paymentResource(db, gatewayServer))
                    .post(`/`)
                    .set("Authorization", jwt)
                    .send({
                        receiver: rando.address,
                        amount: USDC(100000),
                        token: usdc.address,
                    });
                expect(createRes.status).to.equal(400);
                expect(createRes.body.error).to.equal("Insufficient Balance");
            });
            it("ID16 Returns 400 if token is unsupported", async () => {
                const gatewayServer = new GatewayService(
                    gatewayRegistry,
                    onchainProcessor
                );

                const jwt = await login();

                const createRes = await chai
                    .request(paymentResource(db, gatewayServer))
                    .post(`/`)
                    .set("Authorization", jwt)
                    .send({
                        receiver: rando.address,
                        amount: USDC(20),
                        token: dai.address,
                    });
                expect(createRes.status).to.equal(400);
                expect(createRes.body.error).to.equal("Unsupported Token");
            });
        });
    });
    const login = async () => {
        const messageSignature = await user.signMessage(
            AuthService.AuthMessage
        );

        const body = {
            address: user.address,
            messageSignature,
        };
        const res = await chai.request(loginResource(db)).post("/").send(body);

        return res.body.jwt;
    };
});

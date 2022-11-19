import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { PrismaClient } from "@prisma/client";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { GatewayService } from "../../../offchain-processor/service/GatewayService";
import {
    AddPaymentResult,
    PaymentService,
} from "../../../offchain-processor/service/PaymentService";
import { Token } from "../../../offchain-processor/service/types";
import { ERC20, Gateway, GatewayRegistry } from "../../../typechain";
import { clearDb } from "../../contracts/utils/clearDb";
import { mockToken, USDC } from "../../contracts/utils/ERC20Utils";

describe("PaymentService", () => {
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
        clearDb();
    });

    describe("addPayment", () => {
        it("ID 12: Returns UNSUPPORTED if the selected token has no gateway", async () => {
            const gatewayServiceMock = {
                getAllTokens: () => Promise.resolve([]),
            } as unknown as GatewayService;
            const database = new PrismaClient();

            const paymentService = new PaymentService(
                database,
                gatewayServiceMock
            );

            const response = await paymentService.addPayment(
                ethers.constants.AddressZero,
                owner.address,
                rando.address,
                BigNumber.from(0)
            );

            expect(response).to.equal(AddPaymentResult.UNSUPPORTED);
        });
        it("ID 13: Returns ISUFFIECIENT_BALANCE if the allowance of the user is lowaer then the selected ammount", async () => {
            const gatewayServiceMock = {
                getAllTokens: () =>
                    Promise.resolve([
                        {
                            address: dai.address,
                            gateway: daiGateway.address,
                        } as Token,
                    ]),
                getAllowance: (token: string, sender: string) =>
                    Promise.resolve(BigNumber.from(100)),
            } as unknown as GatewayService;
            const database = new PrismaClient();

            const paymentService = new PaymentService(
                database,
                gatewayServiceMock
            );

            const response = await paymentService.addPayment(
                dai.address,
                owner.address,
                rando.address,
                BigNumber.from(1000)
            );

            expect(response).to.equal(AddPaymentResult.INSUFFICIENT_BALANCE);
        });
        it("ID 14: Returns SUCCESS if payment was succcesful", async () => {
            const gatewayServiceMock = {
                getAllTokens: () =>
                    Promise.resolve([
                        {
                            address: dai.address,
                            gateway: daiGateway.address,
                        } as Token,
                    ]),
                getAllowance: (token: string, sender: string) =>
                    Promise.resolve(BigNumber.from(10000)),
                sendPayment: () => Promise.resolve(true),
            } as unknown as GatewayService;
            const database = new PrismaClient();

            const paymentService = new PaymentService(
                database,
                gatewayServiceMock
            );

            const response = await paymentService.addPayment(
                dai.address,
                owner.address,
                rando.address,
                BigNumber.from(1000)
            );

            const payments = await database.payment.count();
            expect(payments).to.equal(1);
            expect(response).to.equal(AddPaymentResult.SUCCESS);
        });
    });

    describe("getPayments", () => {
        it("ID15: returns returns all payments made by the user", async () => {
            const gatewayServiceMock = {
                getAllTokens: () =>
                    Promise.resolve([
                        {
                            address: dai.address,
                            gateway: daiGateway.address,
                        } as Token,
                    ]),
                getAllowance: (token: string, sender: string) =>
                    Promise.resolve(BigNumber.from(10000)),
                sendPayment: () => Promise.resolve(true),
            } as unknown as GatewayService;
            const database = new PrismaClient();

            const paymentService = new PaymentService(
                database,
                gatewayServiceMock
            );

            await paymentService.addPayment(
                dai.address,
                owner.address,
                rando.address,
                BigNumber.from(1000)
            );

            await paymentService.addPayment(
                dai.address,
                owner.address,
                rando.address,
                BigNumber.from(1000)
            );

            await paymentService.addPayment(
                dai.address,
                owner.address,
                rando.address,
                BigNumber.from(1000)
            );

            const payments = await paymentService.getPayments(owner.address);

            expect(payments.length).to.equal(3);
        });
    });
});

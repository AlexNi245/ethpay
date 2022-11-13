import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { PrismaClient } from "@prisma/client";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { GatewayService } from "../../../offchain-processor/service/GatewayService";
import {
    AddPaymentResponse,
    PaymentService,
} from "../../../offchain-processor/service/PaymentService";
import { ERC20, Gateway, GatewayRegistry } from "../../../typechain";
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
    describe("addPayment", () => {
        it.only("ID 12: Returns UNSUPPORTED if the selected token has no gateway", async () => {
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

            expect(response).to.equal(AddPaymentResponse.UNSUPPORTED);
        });
    });
});

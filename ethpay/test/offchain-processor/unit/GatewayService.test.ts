import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { fail } from "assert";
import { assert, expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { GatewayService } from "../../../offchain-processor/service/GatewayService";
import { ERC20, Gateway, GatewayRegistry } from "../../../typechain";
import { mockToken, USDC } from "../../contracts/utils/ERC20Utils";

describe("GatewayService", () => {
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

    
    it("ID1: Get Users onchain allowance", async () => {
        await gatewayRegistry.addToken(usdc.address, usdcGateway.address);

        await usdc
            .connect(user)
            .increaseAllowance(usdcGateway.address, USDC(100));

        const usersAllowance = await new GatewayService(
            gatewayRegistry,
            onchainProcessor
        ).getAllowance(usdc.address, user.address);

        expect(usersAllowance).to.equal(USDC(100));
    });
    it("ID2: Return if Token is not supported", async () => {
        await usdc
            .connect(user)
            .increaseAllowance(usdcGateway.address, USDC(100));

        const usersAllowance = await new GatewayService(
            gatewayRegistry,
            onchainProcessor
        ).getAllowance(usdc.address, user.address);

        expect(usersAllowance).to.equal(BigNumber.from(0));
    });

    it("ID3: Get all the tokens from the registry", async () => {
        await gatewayRegistry.addToken(usdc.address, usdcGateway.address);
        await gatewayRegistry.addToken(dai.address, daiGateway.address);

        const [token1, token2] = await new GatewayService(
            gatewayRegistry,
            onchainProcessor
        ).getAllTokens();

        expect(token1.address).to.equal(usdc.address);
        expect(token1.gateway).to.equal(usdcGateway.address);

        expect(token2.address).to.equal(dai.address);
        expect(token2.gateway).to.equal(daiGateway.address);
    });
    it("ID4: Return all supported tokens", async () => {
        const gatewayRegistryFactory = await ethers.getContractFactory(
            "GatewayRegistry"
        );

        const invalidGatewayRegistry = gatewayRegistryFactory.attach(
            ethers.constants.AddressZero
        ) as GatewayRegistry;

        try {
            const allTokens = await new GatewayService(
                invalidGatewayRegistry,
                onchainProcessor
            ).getAllTokens();
            fail("Method should have thrown");
        } catch (e:any) {
            expect(e).to.not.be.undefined;
        }
    });

    describe("Send Payment", () => {
        it("ID5: Returns true if token is supported and user has balance ", async () => {
            await gatewayRegistry.addToken(usdc.address, usdcGateway.address);

            await usdc
                .connect(user)
                .increaseAllowance(usdcGateway.address, USDC(100));

            const receiverBalanceBefore = await usdc.balanceOf(rando.address);

            const sendPaymentResponse = await new GatewayService(
                gatewayRegistry,
                onchainProcessor
            ).sendPayment(
                usdc.address,
                user.address,
                rando.address,
                USDC(50).toHexString()
            );

            expect(sendPaymentResponse).to.be.true;

            const receiverBalanceAfter = await usdc.balanceOf(rando.address);

            expect(receiverBalanceAfter).to.be.equal(
                receiverBalanceBefore.add(USDC(50))
            );
        });
        it("ID6:Returns false if token allowance is to low ", async () => {
            await gatewayRegistry.addToken(usdc.address, usdcGateway.address);

            const sendPaymentResponse = await new GatewayService(
                gatewayRegistry,
                onchainProcessor
            ).sendPayment(
                usdc.address,
                user.address,
                rando.address,
                USDC(50).toHexString()
            );

            expect(sendPaymentResponse).to.be.false;
        });
        it("ID7: Returns false if token is not supported ", async () => {
            await gatewayRegistry.addToken(usdc.address, usdcGateway.address);

            const sendPaymentResponse = await new GatewayService(
                gatewayRegistry,
                onchainProcessor
            ).sendPayment(
                //Dai was not added to the registry hence its not supported
                dai.address,
                user.address,
                rando.address,
                USDC(50).toHexString()
            );

            expect(sendPaymentResponse).to.be.false;
        });
    });
});

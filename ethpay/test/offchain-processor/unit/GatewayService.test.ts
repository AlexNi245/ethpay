import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { GatewayService } from "../../../offchain-processor/service/GatewayService";
import { ERC20, Gateway, GatewayRegistry } from "../../../typechain";
import { mockToken, USDC } from "../../contracts/utils/ERC20Utils";

describe.only("GatewayService", () => {
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
        ).deploy(usdc.address, onchainProcessor.address)) as Gateway;

        daiGateway = (await (
            await gatewayFactory
        ).deploy(dai.address, onchainProcessor.address)) as Gateway;
    });
    it("Get all the tokens from the registry", async () => {
        await gatewayRegistry.addToken(usdc.address, usdcGateway.address);
        await gatewayRegistry.addToken(dai.address, daiGateway.address);

        const [token1, token2] = await new GatewayService(
            gatewayRegistry
        ).getAllTokens();

        expect(token1.address).to.equal(usdc.address);
        expect(token1.gateway).to.equal(usdcGateway.address);

        expect(token2.address).to.equal(dai.address);
        expect(token2.gateway).to.equal(daiGateway.address);
    });
    it("Get Users onchain allowance", async () => {
        await gatewayRegistry.addToken(usdc.address, usdcGateway.address);
        await gatewayRegistry.addToken(dai.address, daiGateway.address);

        await usdc
            .connect(user)
            .increaseAllowance(usdcGateway.address, USDC(100));

        const usersAllowance = await new GatewayService(
            gatewayRegistry
        ).getAllowance(usdc.address, user.address);


        expect(usersAllowance).to.equal(USDC(100));
    });
});

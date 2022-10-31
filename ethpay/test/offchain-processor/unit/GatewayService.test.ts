import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { GatewayService } from "../../../offchain-processor/service/GatewayService";
import { GatewayRegistry } from "../../../typechain";

describe.only("GatewayService", () => {
    let gatewayRegistry: GatewayRegistry;
    let owner: SignerWithAddress;
    let rando: SignerWithAddress;

    let usdc: SignerWithAddress;
    let usdcGateway: SignerWithAddress;

    let dai: SignerWithAddress;
    let daiGateway: SignerWithAddress;

    beforeEach(async () => {
        [owner, rando, usdc, usdcGateway, dai, daiGateway] =
            await ethers.getSigners();

        const gatewayRegistryFactory = await ethers.getContractFactory(
            "GatewayRegistry"
        );

        gatewayRegistry = (await gatewayRegistryFactory.deploy(
            owner.address
        )) as GatewayRegistry;
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
});

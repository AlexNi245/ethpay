import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { GatewayRegistry } from "typechain";

//@ts-ignore
import { expectRevert, constants } from "@openzeppelin/test-helpers";

describe("GatewayRegistry", () => {
    let owner: SignerWithAddress;
    let rando: SignerWithAddress;

    let token: SignerWithAddress;
    let gateway: SignerWithAddress;

    let gatewayRegistry: GatewayRegistry;
    beforeEach(async () => {
        [owner, rando, token, gateway] = await ethers.getSigners();

        //Deploy contract
        const gatewayRegistryFactory = await ethers.getContractFactory(
            "GatewayRegistry"
        );

        gatewayRegistry = (await gatewayRegistryFactory.deploy(
            owner.address
        )) as GatewayRegistry;
    });
    describe("setOwner", () => {
        it("Owner can change the owner", async () => {
            const currentOwner = await gatewayRegistry.owner();
            expect(currentOwner).to.equal(owner.address);
            //Change owner to rando
            await gatewayRegistry.setOwner(rando.address);

            const newOwner = await gatewayRegistry.owner();
            expect(newOwner).to.equal(rando.address);
        });
        it("Rando can't change the owner", async () => {
            //Change owner to rando
            try {
                gatewayRegistry.connect(rando).setOwner(rando.address);
                //Sould have thrown
                expect(false);
            } catch (e) {
                expect(true);
            }
        });
    });

    describe("setToken", () => {
        it("owner can add new token", async () => {
            await gatewayRegistry.addToken(token.address, gateway.address);

            const supportedToken = await gatewayRegistry.supportedToken(0);
            expect(supportedToken).to.be.equal(token.address);

            const expectedGateway = await gatewayRegistry.gateways(
                token.address
            );
            expect(expectedGateway).to.be.equal(gateway.address);
        });
        it("owner can remove new token", async () => {
            await gatewayRegistry.addToken(token.address, gateway.address);
            await gatewayRegistry.removeToken(token.address);

            const supportedToken = await gatewayRegistry.supportedToken(0);
            expect(supportedToken).to.be.equal(constants.ZERO_ADDRESS);

            const expectedGateway = await gatewayRegistry.gateways(
                token.address
            );
            expect(expectedGateway).to.be.equal(constants.ZERO_ADDRESS);
        });
    });
});

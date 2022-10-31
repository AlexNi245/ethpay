"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const hardhat_1 = require("hardhat");
//@ts-ignore
const test_helpers_1 = require("@openzeppelin/test-helpers");
describe("GatewayRegistry", () => {
    let owner;
    let rando;
    let token;
    let gateway;
    let gatewayRegistry;
    beforeEach(async () => {
        [owner, rando, token, gateway] = await hardhat_1.ethers.getSigners();
        //Deploy contract
        const gatewayRegistryFactory = await hardhat_1.ethers.getContractFactory("GatewayRegistry");
        gatewayRegistry = (await gatewayRegistryFactory.deploy(owner.address));
    });
    describe("setOwner", () => {
        it("Owner can change the owner", async () => {
            const currentOwner = await gatewayRegistry.owner();
            (0, chai_1.expect)(currentOwner).to.equal(owner.address);
            //Change owner to rando
            await gatewayRegistry.setOwner(rando.address);
            const newOwner = await gatewayRegistry.owner();
            (0, chai_1.expect)(newOwner).to.equal(rando.address);
        });
        it("Rando can't change the owner", async () => {
            //Change owner to rando
            try {
                gatewayRegistry.connect(rando).setOwner(rando.address);
                //Sould have thrown
                (0, chai_1.expect)(false);
            }
            catch (e) {
                (0, chai_1.expect)(true);
            }
        });
    });
    describe("setToken", () => {
        it("owner can add new token", async () => {
            await gatewayRegistry.addToken(token.address, gateway.address);
            const supportedToken = await gatewayRegistry.supportedToken(0);
            (0, chai_1.expect)(supportedToken).to.be.equal(token.address);
            const expectedGateway = await gatewayRegistry.gateways(token.address);
            (0, chai_1.expect)(expectedGateway).to.be.equal(gateway.address);
        });
        it("owner can remove new token", async () => {
            await gatewayRegistry.addToken(token.address, gateway.address);
            await gatewayRegistry.removeToken(token.address);
            const supportedToken = await gatewayRegistry.supportedToken(0);
            (0, chai_1.expect)(supportedToken).to.be.equal(test_helpers_1.constants.ZERO_ADDRESS);
            const expectedGateway = await gatewayRegistry.gateways(token.address);
            (0, chai_1.expect)(expectedGateway).to.be.equal(test_helpers_1.constants.ZERO_ADDRESS);
        });
    });
});

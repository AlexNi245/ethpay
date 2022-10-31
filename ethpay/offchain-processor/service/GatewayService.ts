import { ethers } from "hardhat";
import { ERC20, GatewayRegistry } from "../../typechain";
import { token } from "../../typechain/@openzeppelin/contracts";
import { Token } from "./types";

export class GatewayService {
    private readonly gatewayRegistry: GatewayRegistry;

    constructor(gatewayRegistry: GatewayRegistry) {
        this.gatewayRegistry = gatewayRegistry;
    }

    public static async instance(gatewayRegistryUrl: string) {
        const gatewayRegistryFactory = await ethers.getContractFactory(
            "GatewayRegistry"
        );

        const gatewayRegistry = gatewayRegistryFactory.attach(
            gatewayRegistryUrl
        ) as GatewayRegistry;
        return new GatewayService(gatewayRegistry);
    }

    public async getAllTokens(): Promise<Token[]> {
        const tokens = [];
        const numberOfSupportedTokens =
            await this.gatewayRegistry.numberOfSupportedToken();

        while (tokens.length < numberOfSupportedTokens.toNumber()) {
            const token: string = await this.gatewayRegistry.supportedToken(
                tokens.length
            );
            tokens.push(token);
        }

        return await Promise.all(
            tokens.map(
                async (t): Promise<Token> => ({
                    address: t,
                    gateway: await this.gatewayRegistry.gateways(t),
                })
            )
        );
    }

    public async getAllowance(token: string, user: string) {
        const gateway = await this.gatewayRegistry.gateways(token);

        const tokenFactory = await ethers.getContractFactory(
            "contracts/ERC20/ERC20.sol:ERC20"
        );

        const tokenContract = (await tokenFactory.attach(token)) as ERC20;

        return await tokenContract.allowance(user, gateway);
    }
}

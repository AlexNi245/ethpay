import { BigNumber, Signer } from "ethers";
import { ethers } from "hardhat";
import { ERC20, Gateway, GatewayRegistry } from "../../typechain";
import { Token } from "./types";

export class GatewayService {
    private readonly gatewayRegistry: GatewayRegistry;
    private readonly onchainProcessor: Signer;

    constructor(gatewayRegistry: GatewayRegistry, onchainProcessor: Signer) {
        this.gatewayRegistry = gatewayRegistry;
        this.onchainProcessor = onchainProcessor;
    }

    public static async instance(
        gatewayRegistryUrl: string,
        onchainProcessor: Signer
    ) {
        const gatewayRegistryFactory = await ethers.getContractFactory(
            "GatewayRegistry"
        );

        const gatewayRegistry = gatewayRegistryFactory.attach(
            gatewayRegistryUrl
        ) as GatewayRegistry;
        return new GatewayService(gatewayRegistry, onchainProcessor);
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
    public async getBalance(token: string, user: string) {
        const tokenFactory = await ethers.getContractFactory(
            "contracts/ERC20/ERC20.sol:ERC20"
        );

        const tokenContract = (await tokenFactory.attach(token)) as ERC20;

        return await tokenContract.balanceOf(user);
    }

    public async sendPayment(
        token: string,
        sender: string,
        receiver: string,
        amount: string
    ) {
        const gatewayAddress = await this.gatewayRegistry.gateways(token);
        const gatewayFactory = await ethers.getContractFactory("Gateway");
        const gatewayContract = (await gatewayFactory.attach(
            gatewayAddress
        )) as Gateway;

        if (
            gatewayContract.address ===
            "0x0000000000000000000000000000000000000000"
        ) {
            //Token is not supported
            return undefined;
        }

        const allowance = await this.getAllowance(token, sender);

        if (allowance.lt(BigNumber.from(amount))) {
            //Allowance is to low
            return undefined;
        }
        try {
            const gasPrice = await ethers.provider.getGasPrice();
            const transactionReceipt = await gatewayContract
                .connect(this.onchainProcessor)
                .transferFrom(sender, receiver, amount, {
                    gasLimit: BigNumber.from("300000"),
                    gasPrice: gasPrice.mul(2),
                });

            await transactionReceipt.wait();

            return transactionReceipt.hash;
        } catch (e) {
            console.log(e);
            return undefined;
        }
    }
}

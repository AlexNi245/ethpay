import { getAddress } from "@ethersproject/address";
import { PrismaClient } from "@prisma/client";
import { BigNumber } from "ethers";
import { GatewayService } from "./GatewayService";

const VARIABLE_FEE = "";
const FIXED_FEE = "";

export class PaymentService {
    private readonly gatewayService: GatewayService;
    private readonly db: PrismaClient;

    constructor(db: PrismaClient, gatewayService: GatewayService) {
        this.db = db;
        this.gatewayService = gatewayService;
    }

    public async addPayment(
        token: string,
        sender: string,
        receiver: string,
        amount: BigNumber
    ) {
        const allTokens = await this.gatewayService.getAllTokens();
        const isSupported = allTokens.find(
            ({ address }) => getAddress(address) === getAddress(token)
        );

        if (!isSupported) {
            return AddPaymentResponse.UNSUPPORTED;
        }
    }
}

export enum AddPaymentResponse {
    UNSUPPORTED,
}

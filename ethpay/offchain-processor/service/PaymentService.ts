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

        const allowance = await this.gatewayService.getAllowance(token, sender);

        if (allowance.lt(amount)) {
            return AddPaymentResponse.INSUFFICIENT_BALANCE;
        }

        const success = await this.gatewayService.sendPayment(
            token,
            sender,
            receiver,
            amount.toHexString()
        );

        if (!success) {
            return AddPaymentResponse.FAILURE;
        }
        await this.db.payments.create({
            data: {
                senderAddress: sender,
                receiverAddress: receiver,
                Token: token,
                Amount: amount.toNumber(),
            },
        });
        return AddPaymentResponse.SUCCESS;
    }
    public getPayments(userUid: string) {
        return this.db.payments.findMany({
            where: {
                senderAddress: {
                    equals: userUid,
                },
            },
        });
    }
}

export enum AddPaymentResponse {
    UNSUPPORTED,
    INSUFFICIENT_BALANCE,
    SUCCESS,
    FAILURE,
}

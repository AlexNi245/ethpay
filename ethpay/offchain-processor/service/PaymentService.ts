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
            return {
                result: AddPaymentResult.UNSUPPORTED,
            };
        }

        const allowance = await this.gatewayService.getAllowance(token, sender);

        if (allowance.lt(amount)) {
            return {
                result: AddPaymentResult.INSUFFICIENT_ALLOWANCE,
            };
        }

        const balance = await this.gatewayService.getBalance(token, sender);

        if (balance.lt(amount)) {
            return {
                result: AddPaymentResult.INSUFFICIENT_BALANCE,
            };
        }

        const success = await this.gatewayService.sendPayment(
            token,
            sender,
            receiver,
            amount.toHexString()
        );

        if (!success) {
            return {
                result: AddPaymentResult.FAILURE,
            };
        }
        const { id } = await this.db.payment.create({
            data: {
                senderAddress: sender,
                receiverAddress: receiver,
                Token: token,
                Amount: amount.toHexString(),
            },
        });

        return {
            result: AddPaymentResult.SUCCESS,
            payload: id,
        };
    }
    public getPaymentById(id: string) {
        return this.db.payment.findFirst({
            where: {
                id: {
                    equals: Number.parseInt(id),
                },
            },
        });
    }
    public getPayments(address: string) {
        return this.db.payment.findMany({
            where: {
                senderAddress: {
                    equals: address,
                },
            },
        });
    }
}

export enum AddPaymentResult {
    UNSUPPORTED,
    INSUFFICIENT_BALANCE,
    INSUFFICIENT_ALLOWANCE,
    SUCCESS,
    FAILURE,
}

export interface AddPaymentResponse {
    result: AddPaymentResult;
    payload: any;
}

import { PrismaClient } from "@prisma/client";
import { ethers } from "ethers";
import * as jwt from "jsonwebtoken";

//Todo move to env later
const encryptionkey = "encryption";

export class AuthService {
    private readonly db: PrismaClient;
    public static AuthMessage = "I accept the Terms of Service of Ethpay";

    constructor(db: PrismaClient) {
        this.db = db;
    }

    public async login(
        address: string,
        messageSignature: string
    ): Promise<string | null> {
        if (!this.checkIfSignedMessageIsValid(messageSignature, address)) {
            return null;
        }
        await this.db.user.create({
            data: { address, messageSignature },
        });

        const jwtToken = jwt.sign(
            {
                iss: "ethpay",
                sub: address,
                iat: new Date().getTime(),
            },
            encryptionkey
        );

        return jwtToken;
    }

    public async isLoggedIn(address: string) {
        const session = await this.db.user.findFirst({
            where: { address },
        });

        return !!session;
    }
    public getAddress(token: string) {
        try {
            const { sub } = jwt.verify(token, encryptionkey);
            //This token is not valid
            if (!sub) {
                return undefined;
            }

            return sub.toString();
        } catch (e) {
            return undefined;
        }
    }

    private checkIfSignedMessageIsValid(
        messageSignature: string,
        address: string
    ): boolean {
        const sender = ethers.utils.verifyMessage(
            AuthService.AuthMessage,
            messageSignature
        );
        return (
            ethers.utils.getAddress(sender) === ethers.utils.getAddress(address)
        );
    }
}

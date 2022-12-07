import { BigNumber, ethers } from "ethers";
import React from "react";
import { HttpClient } from "../client/HttpClient";

export const PaymentContext = React.createContext({
    makeUsdcPayment: (
        sender: string,
        amountNumber: number,
        receiver: string
    ): Promise<{ id?: string; error?: string }> => Promise.resolve({ id: "" }),
    makeMaticPayment: (
        sender: string,
        amountNumber: number,
        receiver: string
    ): Promise<{ id?: string; error?: string }> => Promise.resolve({ id: "" }),
    makeBtcPayment: (
        sender: string,
        amountNumber: number,
        receiver: string
    ): Promise<{ id?: string; error?: string }> => Promise.resolve({ id: "" }),
});

export const PaymentContextProvider = (props: { children?: any }) => {
    const supportedTokens = [
        {
            address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
            gateway: "0x571968E5101857541773f22D7d187Bb36458Eab3",
            name: "WMATC",
            decimals: 18,
        },
        {
            address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
            gateway: "0xEb7bfccd9E7c463c7f147B4130220fB40C64b764",
            name: "WBTC",
            decimals: 8,
        },
        {
            address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
            gateway: "0x976fadAeE145C8Ad01F09E892e0F20bddce23C74",
            name: "USDC",
            decimals: 6,
        },
    ];

    const makePayment = async (
        sender: string,
        amountNumber: number,
        receiver: string,
        {
            decimals,
            address,
        }: {
            decimals: number;
            address: string;
        }
    ) => {
        const amount = ethers.utils.parseUnits(
            amountNumber.toString(),
            decimals
        );

        const { id, error } = await new HttpClient().sendPayment(
            sender,
            address,
            receiver,
            amount.toHexString()
        );

        return { id, error };
    };
    const makeMaticPayment = (
        sender: string,
        amountNumber: number,
        receiver: string
    ) => makePayment(sender, amountNumber, receiver, supportedTokens[0]);
    const makeBtcPayment = (
        sender: string,
        amountNumber: number,
        receiver: string
    ) => {
        function toFixed(x: any) {
            if (Math.abs(x) < 1.0) {
                var e = parseInt(x.toString().split("e-")[1]);
                if (e) {
                    x *= Math.pow(10, e - 1);
                    x =
                        "0." +
                        new Array(e).join("0") +
                        x.toString().substring(2);
                }
            } else {
                var e = parseInt(x.toString().split("+")[1]);
                if (e > 20) {
                    e -= 20;
                    x /= Math.pow(10, e);
                    x += new Array(e + 1).join("0");
                }
            }
            return x;
        }
        return makePayment(
            sender,
            toFixed(amountNumber),
            receiver,
            supportedTokens[1]
        );
    };

    const makeUsdcPayment = (
        sender: string,
        amountNumber: number,
        receiver: string
    ) => makePayment(sender, amountNumber, receiver, supportedTokens[2]);

    return (
        <PaymentContext.Provider
            value={{
                makeMaticPayment,
                makeBtcPayment,
                makeUsdcPayment,
            }}
        >
            {props.children}
        </PaymentContext.Provider>
    );
};

import { BigNumber, ethers } from "ethers";
import React from "react";
import { HttpClient } from "../client/HttpClient";

export const PaymentContext = React.createContext({
    makeUsdcPayment: (
        sender: string,
        amountNumber: number,
        receiver: string
    ): Promise<string> => Promise.resolve(""),
    makeMaticPayment: (
        sender: string,
        amountNumber: number,
        receiver: string
    ): Promise<string> => Promise.resolve(""),
    makeBtcPayment: (
        sender: string,
        amountNumber: number,
        receiver: string
    ): Promise<string> => Promise.resolve(""),
});

export const PaymentContextProvider = (props: { children?: any }) => {
    const supportedTokens = [
        {
            address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
            gateway: "0x891F9aEC186AfC73A0dFdBba66C61806D7943077",
            name: "WMATC",
            decimals: 18,
        },
        {
            address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
            gateway: "0x27D760931173601880693a38416f8A481C1E5214",
            name: "WBTC",
            decimals: 8,
        },
        {
            address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
            gateway: "0xf83C648A28f5194Eb8BE11270Aa0271d36d7802a",
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
        const {id} = await new HttpClient().sendPayment(
            sender,
            address,
            receiver,
            amount.toHexString()
        );

        return id;
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
    ) => makePayment(sender, amountNumber, receiver, supportedTokens[1]);

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

import React, { useState } from "react";

export enum STEPS {
    Overview,
    Confirmation,
}
export const PaymentModalContext = React.createContext({
    steps: STEPS.Overview,
    setSteps: (_: any) => {},
    payment: {},
});

export const PaymentModalContextProvider = (props: {
    children?: any;
    name: string;
    amount: number;
    token: string;
    currency: string;
    receiver: string;
}) => {
    const [steps, setSteps] = useState(STEPS.Overview);

    const { children, ...initialPayment } = props;

    const [payment, setpayment] = useState(initialPayment);

    return (
        <PaymentModalContext.Provider value={{ steps, payment, setSteps }}>
            {children}
        </PaymentModalContext.Provider>
    );
};

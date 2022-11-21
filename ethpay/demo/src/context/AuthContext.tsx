import React from "react";
import { HttpClient } from "../client/HttpClient";
import { Database } from "../storage/Database";

export const AuthContext = React.createContext({
    login: (_: string, __: string) => {},
    getSession: (_: string): string | undefined => {return undefined},
});

export const AuthContextProvider = (props: { children?: any }) => {
    const db = new Database();

    const login = async (address: string, messageSignature: string) => {
        const res = await new HttpClient().login(
            address as string,
            messageSignature
        );
        if (!res) {
            throw Error("Login failed");
        }

        db.login(address, res.data);
    };

    const getSession = (address: string) => {
        return db.getSession(address);
    };

    return (
        <AuthContext.Provider value={{ login, getSession }}>
            {props.children}
        </AuthContext.Provider>
    );
};

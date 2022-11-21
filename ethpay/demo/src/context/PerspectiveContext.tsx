import React, { useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Perspective } from "../views/Perspective/Perspective";
import { AuthContext } from "./AuthContext";

export enum Perspectives {
    LOGIN,
    MERCHANT,
    USER,
}

export const PerspectiveContext = React.createContext({
    currentPerspective: Perspectives.LOGIN,
    setCurrentPerspective: (_: Perspectives) => {},
});

export const PerspectiveContextProvider = (props: { children?: any }) => {
    const [currentPerspective, setCurrentPerspective] = useState(
        Perspectives.LOGIN
    );
    const { address } = useAccount();

    const { getSession } = useContext(AuthContext);
    useEffect(() => {
        const isLoggedIn = () => !!getSession(address as string);
        if (currentPerspective === Perspectives.USER && !isLoggedIn()) {
            console.log("User has no session move to login");
            setCurrentPerspective(Perspectives.LOGIN);
        }
    }, [currentPerspective, address, getSession]);

    //TODO add on Account change hook

    return (
        <PerspectiveContext.Provider
            value={{
                currentPerspective,
                setCurrentPerspective,
            }}
        >
            {props.children}
        </PerspectiveContext.Provider>
    );
};

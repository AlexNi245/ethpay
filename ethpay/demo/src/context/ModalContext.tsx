import { useDisclosure } from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { ModalWrapper } from "../modal/ModalWrapper";
import { PaymentModal } from "../modal/PaymentModal";

export type ModalContextType = {
    isOpen: boolean;
    openModal: (modal: MODAL_TYPE, props: any) => void;
    onClose: () => void;
};

export enum MODAL_TYPE {
    PAYMENT_MODAL,
}

export const ModalContext = React.createContext<ModalContextType>({
    isOpen: false,
    openModal: (_: MODAL_TYPE, __: any) => {},
    onClose: () => {},
});

export const ModalContextProvider = ({ children }: { children?: any }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [modal, setModal] = useState<React.ReactNode>(<></>);

    const openModal = useCallback(
        (modal: MODAL_TYPE, props: any) => {
            switch (modal) {
                case MODAL_TYPE.PAYMENT_MODAL:
                    setModal(<PaymentModal {...props} />);
                    onOpen();
                    return;
                default:
                    throw Error("Unsupported modal ");
            }
        },
        [onOpen]
    );

    return (
        <ModalContext.Provider value={{ isOpen, openModal, onClose }}>
            <>
                <ModalWrapper modal={modal} />
                {children}
            </>
        </ModalContext.Provider>
    );
};

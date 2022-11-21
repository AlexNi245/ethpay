import { Modal, ModalOverlay } from "@chakra-ui/react";
import React, { useContext } from "react";
import { ModalContext } from "../context/ModalContext";

export const ModalWrapper = ({ modal }: { modal: React.ReactNode }) => {
    const { isOpen, onClose } = useContext(ModalContext);

    return (
        <Modal scrollBehavior="inside" isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            {modal}
        </Modal>
    );
};

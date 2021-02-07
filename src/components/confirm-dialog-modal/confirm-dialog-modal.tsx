import React, { ReactNode } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button
} from '@chakra-ui/react';

export interface ConfirmDialogModalProps {
  isOpen: boolean;
  title: string;
  size?: string;
  description: ReactNode;
  onSubmit: (ok: boolean) => void;
}

export default function ConfirmDialogModal({
  title,
  description,
  isOpen,
  size = 'md',
  onSubmit
}: ConfirmDialogModalProps) {
  return (
    <Modal isOpen={isOpen} size={size} onClose={() => onSubmit(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{description}</ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            mr={3}
            colorScheme="green"
            onClick={() => onSubmit(true)}
          >
            Yes
          </Button>
          <Button colorScheme="red" onClick={() => onSubmit(false)}>
            No
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

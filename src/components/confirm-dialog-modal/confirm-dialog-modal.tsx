import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  ModalFooter,
  Button
} from '@chakra-ui/core';

export interface ConfirmDialogModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onSubmit: (ok: boolean) => void;
}

export default function ConfirmDialogModal({
  title,
  description,
  isOpen,
  onSubmit
}: ConfirmDialogModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={() => onSubmit(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>{description}</Text>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            mr={3}
            variantColor="green"
            onClick={() => onSubmit(true)}
          >
            Yes
          </Button>
          <Button variantColor="red" onClick={() => onSubmit(false)}>
            No
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Stack
} from '@chakra-ui/core';
import { Formula } from '../../contracts/formula';
import AppForm from '../app-form/app-form';

export interface AppFormModalProps {
  app?: Formula;
  isOpen: boolean;
  onClose: () => void;
}

export default function AppFormModal({
  app,
  isOpen,
  onClose
}: AppFormModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{`Create ${app?.name} App`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{app && <AppForm app={app} />}</ModalBody>

        <ModalFooter>
          <Stack direction="row">
            <Button variantColor="green" variant="outline">
              Create
            </Button>
            <Button variantColor="red" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

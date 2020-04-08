import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Code
} from '@chakra-ui/core';

export interface LogsModalProps {
  appName: string;
  logs: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function LogsModal({
  appName,
  logs,
  isOpen,
  onClose
}: LogsModalProps) {
  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{`${appName} logs`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Code
            overflow="auto"
            style={{ whiteSpace: 'pre-wrap' }}
            maxHeight={500}
            width="100%"
            p={2}
          >
            {logs}
          </Code>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

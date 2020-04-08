import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Code,
  Switch,
  Stack,
  FormLabel
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
  const [followTail, setFollowTail] = useState(true);

  useEffect(() => {
    const logsContainer = document.getElementById('logs-container');

    if (logsContainer && followTail) {
      logsContainer.scrollTop = logsContainer.scrollHeight;
    }
  }, [followTail, logs]);

  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{`${appName} logs`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack>
            <Stack direction="row" alignItems="center">
              <Switch
                id="switch-follow-tail"
                isChecked={followTail}
                onChange={() => setFollowTail((followTail) => !followTail)}
              />
              <FormLabel htmlFor="switch-follow-tail">Follow tail</FormLabel>
            </Stack>
            <Code
              id="logs-container"
              overflow="auto"
              style={{ whiteSpace: 'pre-wrap' }}
              maxHeight={500}
              width="100%"
              p={2}
            >
              {logs}
            </Code>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Switch,
  Stack,
  FormLabel,
  Box
} from '@chakra-ui/react';
import Terminal from '../terminal/terminal';

export interface LogsModalProps {
  appName: string;
  stream?: NodeJS.ReadWriteStream;
  isOpen: boolean;
  onClose: () => void;
}

export default function LogsModal({
  appName,
  stream,
  isOpen,
  onClose
}: LogsModalProps) {
  const [followTail, setFollowTail] = useState(true);

  return (
    <Modal
      size="full"
      scrollBehavior="inside"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{`${appName} logs`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack height="100%">
            <Stack direction="row" alignItems="center">
              <Switch
                id="switch-follow-tail"
                isChecked={followTail}
                onChange={() => setFollowTail((followTail) => !followTail)}
              />
              <FormLabel htmlFor="switch-follow-tail">Follow tail</FormLabel>
            </Stack>
            <Box width="100%" height="94%" p={2} pr={0} pl={0}>
              {stream && <Terminal stream={stream} followTail={followTail} />}
            </Box>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

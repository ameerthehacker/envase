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
import { Formik } from 'formik';
import { DockerConfig, getConfig } from '../../services/docker';
import Settings from '../settings/settings';

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (result: DockerConfig) => void;
}

interface AllSettings extends DockerConfig {
  terminalFontSize: number;
}

export default function SettingsModal({
  isOpen,
  onClose,
  onSubmit
}: SettingsModalProps) {
  const dockerConfig = getConfig();
  // if anyone of them is undefined the input would become uncontrolled
  if (!dockerConfig.socketPath) dockerConfig.socketPath = '';
  if (!dockerConfig.host) dockerConfig.host = '';
  if (!dockerConfig.port) dockerConfig.port = '';
  if (!dockerConfig.username) dockerConfig.username = '';
  if (!dockerConfig.password) dockerConfig.password = '';

  const settings: AllSettings = {
    ...dockerConfig,
    terminalFontSize: 16
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <Formik validateOnMount initialValues={settings} onSubmit={onSubmit}>
        {({ submitForm, resetForm }) => (
          <ModalContent>
            <ModalHeader>Preferences</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Settings />
            </ModalBody>
            <ModalFooter>
              <Stack direction="row">
                <Button
                  onClick={submitForm}
                  variantColor="green"
                  variant="outline"
                >
                  Save
                </Button>
                <Button variantColor="red" mr={3} onClick={() => resetForm()}>
                  Reset
                </Button>
              </Stack>
            </ModalFooter>
          </ModalContent>
        )}
      </Formik>
    </Modal>
  );
}

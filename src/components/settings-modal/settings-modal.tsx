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
} from '@chakra-ui/react';
import { Formik } from 'formik';
import Settings from '../settings/settings';
import { AllSettings } from '../../contracts/all-settings';

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (result: AllSettings) => void;
  allSettings: AllSettings;
}

export default function SettingsModal({
  isOpen,
  onClose,
  onSubmit,
  allSettings
}: SettingsModalProps) {
  // if anyone of them is undefined the input would become uncontrolled
  if (!allSettings.socketPath) allSettings.socketPath = '';
  if (!allSettings.host) allSettings.host = '';
  if (!allSettings.port) allSettings.port = '';
  if (!allSettings.username) allSettings.username = '';
  if (!allSettings.password) allSettings.password = '';

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <Formik validateOnMount initialValues={allSettings} onSubmit={onSubmit}>
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
                  colorScheme="green"
                  variant="outline"
                >
                  Save
                </Button>
                <Button colorScheme="red" mr={3} onClick={() => resetForm()}>
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

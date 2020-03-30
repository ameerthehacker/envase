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
import { Formik } from 'formik';

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
  const data = app?.data || {};
  const fieldNames = Object.keys(data || {});
  const initialValues: { [name: string]: string } = {};

  // populate the initial values
  for (const fieldName of fieldNames) {
    initialValues[fieldName] = String(data[fieldName].default || '');
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <Formik
        validateOnMount
        initialValues={initialValues}
        onSubmit={(values) => console.log(values)}
      >
        {({ isValid, submitForm }) => (
          <ModalContent>
            <ModalHeader>{`Create ${app?.name} App`}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>{app && <AppForm app={app} />}</ModalBody>
            <ModalFooter>
              <Stack direction="row">
                <Button
                  isDisabled={!isValid}
                  onClick={submitForm}
                  variantColor="green"
                  variant="outline"
                >
                  Create
                </Button>
                <Button variantColor="red" mr={3} onClick={onClose}>
                  Cancel
                </Button>
              </Stack>
            </ModalFooter>
          </ModalContent>
        )}
      </Formik>
    </Modal>
  );
}

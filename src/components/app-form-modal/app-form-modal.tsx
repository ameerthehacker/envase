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
  isValidating?: boolean;
  values?: AppFormResult;
  onSubmit?: (result: AppFormResult) => void;
  isReadOnly?: boolean;
}

export interface AppFormResult {
  [key: string]: any;
  version: string;
  additionalPorts: string[];
}

export default function AppFormModal({
  app,
  isOpen,
  onClose,
  isValidating,
  onSubmit,
  values,
  isReadOnly
}: AppFormModalProps) {
  const data: any = app?.data || {};
  const fieldNames = Object.keys(data || {});
  const initialValues: AppFormResult = values || {
    version: '',
    additionalPorts: []
  };

  if (!values) {
    // populate the initial values
    for (const fieldName of fieldNames) {
      initialValues[fieldName] = String(data[fieldName].default || '');
    }
  }

  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <Formik
        validateOnMount
        initialValues={initialValues}
        onSubmit={onSubmit || (() => null)}
      >
        {({ isValid, submitForm }) => (
          <ModalContent>
            <ModalHeader>
              {isReadOnly ? app?.name : `Create ${app?.name} App`}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {app && <AppForm isReadOnly={isReadOnly} app={app} />}
            </ModalBody>
            {!isReadOnly && (
              <ModalFooter>
                <Stack direction="row">
                  <Button
                    isLoading={isValidating}
                    isDisabled={!isValid}
                    onClick={submitForm}
                    variantColor="green"
                    variant="outline"
                    loadingText="Validating..."
                  >
                    Create
                  </Button>
                  <Button variantColor="red" mr={3} onClick={onClose}>
                    Cancel
                  </Button>
                </Stack>
              </ModalFooter>
            )}
          </ModalContent>
        )}
      </Formik>
    </Modal>
  );
}

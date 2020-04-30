import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage
} from '@chakra-ui/core';
import { Formik, Form, Field } from 'formik';
import { requiredValidator } from '../../utils/utils';

export interface ExecModalProps {
  isOpen: boolean;
  onSubmit: (cmd: string | null) => void;
}

export default function ExecModal({ isOpen, onSubmit }: ExecModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={() => onSubmit(null)}>
      <ModalOverlay />
      <Formik
        validateOnChange
        validateOnMount
        initialValues={{ command: '' }}
        onSubmit={(values) => onSubmit(values.command)}
      >
        {({ isValid, submitForm }) => (
          <ModalContent>
            <ModalHeader>Exec</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Form>
                <Field name="command" validate={requiredValidator('command')}>
                  {({ field, form }: { field: any; form: any }) => (
                    <FormControl
                      isInvalid={form.errors.command && form.touched.command}
                    >
                      <FormLabel htmlFor="cmd">Command</FormLabel>
                      <Input
                        id="cmd"
                        placeholder="Enter the command to execute"
                        {...field}
                      />
                      <FormErrorMessage>{form.errors.command}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button
                isDisabled={!isValid}
                variant="outline"
                mr={3}
                onClick={submitForm}
                variantColor="green"
              >
                Execute
              </Button>
              <Button variantColor="red" onClick={() => onSubmit(null)}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        )}
      </Formik>
    </Modal>
  );
}

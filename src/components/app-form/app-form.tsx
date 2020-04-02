import React from 'react';
import { Formula } from '../../contracts/formula';
import {
  Box,
  FormLabel,
  Input,
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormControl,
  FormErrorMessage
} from '@chakra-ui/core';
import { capitalize } from '../../utils/utils';
import { Field, Form } from 'formik';
import FolderPicker from '../folder-picker/folder-picker';
import VersionDropdown from '../version-dropdown/version-dropdown';

export interface AppFormProps {
  app: Formula;
}

function getInputType(type: string) {
  switch (type) {
    case 'string':
      return 'text';
    case 'password':
      return 'password';
  }
}

export default function AppForm({ app }: AppFormProps) {
  const { data } = app;
  const fieldNames = Object.keys(data);

  function requiredValidator(fieldName: string) {
    return (value: string) => {
      let error;

      if (!value) {
        error = `${fieldName} is required`;
      }

      return error;
    };
  }

  const formElements = fieldNames.map((fieldName, index) => {
    const type = data[fieldName].type;
    const isInputField = type === 'string' || type === 'password';
    const isNumberField = type === 'number';
    const isPathField = type === 'path';
    let validator: ((value: string) => string | undefined) | undefined;
    // placeholder should show optional if it is not required
    const placeholder = `${data[fieldName].description}${
      data[fieldName].required ? '' : ' (optional)'
    }`;
    // unique id for each field
    const fieldId = `${fieldName}-field`;

    if (data[fieldName].required) {
      validator = requiredValidator(fieldName);
    } else {
      validator = undefined;
    }

    return (
      /* eslint-disable @typescript-eslint/no-explicit-any */
      <Box key={index}>
        <Field name={fieldName} validate={validator}>
          {({ field, form }: { field: any; form: any }) => (
            <FormControl
              isInvalid={form.errors[fieldName] && form.touched[fieldName]}
            >
              <FormLabel htmlFor={fieldId}>{capitalize(fieldName)}</FormLabel>
              {isInputField && (
                <Input
                  type={getInputType(type)}
                  id={fieldId}
                  placeholder={placeholder}
                  {...field}
                />
              )}
              {isNumberField && (
                <NumberInput>
                  <NumberInputField
                    id={fieldId}
                    placeholder={placeholder}
                    {...field}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              )}
              {isPathField && (
                <FolderPicker
                  id={fieldId}
                  placeholder={placeholder}
                  {...field}
                  {...form}
                />
              )}
              <FormErrorMessage>{form.errors[fieldName]}</FormErrorMessage>
            </FormControl>
          )}
        </Field>
      </Box>
    );
  });

  return (
    <Form>
      <Stack spacing={2}>
        {formElements}
        <Field name="version" validate={requiredValidator('version')}>
          {({ field, form }: { field: any; form: any }) => (
            <FormControl>
              <FormLabel htmlFor="field-version">Version / Tag</FormLabel>
              <VersionDropdown
                id="field-version"
                image={app.image}
                {...field}
                {...form}
                placeholder="Select the app version / tag"
              />
            </FormControl>
          )}
        </Field>
      </Stack>
    </Form>
  );
}

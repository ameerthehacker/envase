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
import { Formik, FormikHelpers, Field, Form } from 'formik';

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
  const initialValues: { [name: string]: string } = {};

  for (const fieldName of fieldNames) {
    initialValues[fieldName] = String(data[fieldName].default || '');
  }

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
              <FormErrorMessage>{form.errors[fieldName]}</FormErrorMessage>
            </FormControl>
          )}
        </Field>
      </Box>
    );
  });

  return (
    <Formik
      initialValues={initialValues}
      validateOnChange
      onSubmit={(
        values: { [name: string]: string },
        { setSubmitting }: FormikHelpers<any>
      ) => {
        setSubmitting(false);
      }}
    >
      {({ handleSubmit }) => {
        return (
          <Form onSubmit={handleSubmit}>
            <Stack spacing={2}>{formElements}</Stack>
          </Form>
        );
      }}
    </Formik>
  );
}

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
  FormErrorMessage,
  Link,
  Select
} from '@chakra-ui/core';
import { keyToLabelText, requiredValidator } from '../../utils/utils';
import { Field, Form } from 'formik';
import FolderPicker from '../folder-picker/folder-picker';
import VersionDropdown from '../version-dropdown/version-dropdown';
import { getDockerHubLinkToTags } from '../../utils/utils';
import { open } from '../../services/native/native';

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

// TODO: use formprops and formikprops types
export default function AppForm({ app }: AppFormProps) {
  const { data } = app;
  const fieldNames = Object.keys(data);

  const formElements = fieldNames.map((fieldName, index) => {
    const type = data[fieldName].type;
    const isInputField = type === 'string' || type === 'password';
    const isNumberField = type === 'number';
    const isPathField = type === 'path';
    const isSelectField = type === 'option';
    let validator: ((value: string) => string | undefined) | undefined;
    // placeholder should show optional if it is not required
    const placeholder = `${data[fieldName].description}${
      data[fieldName].required ? '' : ' (optional)'
    }`;
    // unique id for each field
    const fieldId = `${fieldName}-field`;
    const options = data[fieldName].options || [];

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
              <FormLabel htmlFor={fieldId}>
                {keyToLabelText(fieldName)}
              </FormLabel>
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
              {isSelectField && (
                <Select id={fieldId} placeholder={placeholder} {...field}>
                  {options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
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
        <Box>
          <FormControl>
            <FormLabel htmlFor="image">Image</FormLabel>
            <Input id="image" value={app.image} isDisabled={true} />
          </FormControl>
        </Box>
        {formElements}
        <Box>
          <Field name="version" validate={requiredValidator('version')}>
            {({ field, form }: { field: any; form: any }) => (
              <FormControl
                isInvalid={form.errors.version && form.touched.version}
              >
                <FormLabel htmlFor="field-version">Version/Tag</FormLabel>
                <VersionDropdown
                  id="field-version"
                  image={app.image}
                  field={field}
                  form={form}
                  placeholder="App version/tag"
                />
                <Link
                  fontSize="small"
                  onClick={() => open(`${getDockerHubLinkToTags(app.image)}`)}
                  isExternal
                >
                  View all available versions/tags
                </Link>
                <FormErrorMessage>{form.errors.version}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
        </Box>
      </Stack>
    </Form>
  );
}

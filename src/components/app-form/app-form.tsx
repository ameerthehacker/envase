import React from 'react';
import { Formula } from '../../contracts/formula';
import {
  Box,
  FormLabel,
  Input,
  Stack,
  NumberInput,
  NumberInputField,
  FormControl,
  FormErrorMessage,
  Link,
  Select,
  Accordion,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button
} from '@chakra-ui/core';
import { keyToLabelText, requiredValidator } from '../../utils/utils';
import { Field, FieldArray, Form } from 'formik';
import FolderPicker from '../folder-picker/folder-picker';
import VersionDropdown from '../version-dropdown/version-dropdown';
import { getDockerHubLinkToTags } from '../../utils/utils';
import { open } from '../../services/native/native';
import { IconButton } from '@chakra-ui/core/dist';

export interface AppFormProps {
  app: Formula;
  isReadOnly?: boolean;
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
export default function AppForm({ app, isReadOnly }: AppFormProps) {
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
                  isDisabled={isReadOnly}
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
                    isDisabled={isReadOnly}
                    placeholder={placeholder}
                    {...field}
                  />
                </NumberInput>
              )}
              {isSelectField && (
                <Select
                  id={fieldId}
                  placeholder={placeholder}
                  isDisabled={isReadOnly}
                  {...field}
                >
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
                  isDisabled={isReadOnly}
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
      <Accordion defaultIndex={isReadOnly ? [0, 1] : [0]} allowMultiple>
        <AccordionItem>
          <AccordionHeader pl={1} pr={1}>
            <Box flex={1} textAlign="left">
              Basic
            </Box>
            <AccordionIcon />
          </AccordionHeader>
          <AccordionPanel p={1}>
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
                        isDisabled={isReadOnly}
                      />
                      <Link
                        fontSize="small"
                        onClick={() =>
                          open(`${getDockerHubLinkToTags(app.image)}`)
                        }
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
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem mt={2} pb={2}>
          <AccordionHeader pl={1} pr={1}>
            <Box flex={1} textAlign="left">
              Advanced
            </Box>
            <AccordionIcon />
          </AccordionHeader>
          <AccordionPanel p={1}>
            <FieldArray name={'additionalPorts'}>
              {(helpers) => (
                <>
                  <FormLabel>Additional Ports to expose</FormLabel>
                  <Stack spacing={2}>
                    {helpers.form.values.additionalPorts.map(
                      (additionalPort: string, index: number) => (
                        <FormControl key={index}>
                          <Field
                            name={`additionalPorts.${index}`}
                            validate={requiredValidator(
                              'additionalPorts',
                              'port number'
                            )}
                          >
                            {({ field, form }: { field: any; form: any }) => (
                              <FormControl
                                isInvalid={
                                  form.errors.additionalPorts &&
                                  form.touched.additionalPorts &&
                                  form.errors.additionalPorts[index] &&
                                  form.touched.additionalPorts[index]
                                }
                              >
                                <Stack direction={'row'}>
                                  <Box w={'100%'}>
                                    <NumberInput>
                                      <NumberInputField
                                        placeholder="Container port to expose"
                                        isDisabled={isReadOnly}
                                        {...field}
                                      />
                                    </NumberInput>
                                    <FormErrorMessage>
                                      {form.errors.additionalPorts &&
                                        form.errors.additionalPorts[index]}
                                    </FormErrorMessage>
                                  </Box>
                                  {!isReadOnly && (
                                    <IconButton
                                      onClick={() => helpers.remove(index)}
                                      aria-label={'delete'}
                                      icon={'delete'}
                                      variantColor={'red'}
                                    />
                                  )}
                                </Stack>
                              </FormControl>
                            )}
                          </Field>
                        </FormControl>
                      )
                    )}
                  </Stack>
                  {!isReadOnly && (
                    <Button
                      onClick={() => helpers.push('')}
                      variantColor="blue"
                      mt={2}
                      leftIcon="add"
                      size="sm"
                    >
                      Add Port
                    </Button>
                  )}
                </>
              )}
            </FieldArray>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Form>
  );
}

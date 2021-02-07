import React, { ChangeEvent } from 'react';
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
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Image,
  Tooltip,
  Icon,
  Flex
} from '@chakra-ui/react';
import {
  isValidContainerName,
  keyToLabelText,
  requiredValidator
} from '../../utils/utils';
import { Field, FieldArray, Form } from 'formik';
import FolderPicker from '../folder-picker/folder-picker';
import VersionDropdown from '../version-dropdown/version-dropdown';
import { getDockerHubLinkToTags } from '../../utils/utils';
import { open } from '../../services/native/native';
import { IconButton } from '@chakra-ui/react';
import { useAppStatus, AppStatus } from '../../contexts/app-status/app-status';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

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

function validateAppName(name: string) {
  const isNotEmpty = requiredValidator('name')(name);

  if (isNotEmpty) {
    return isNotEmpty;
  } else if (!isValidContainerName(name)) {
    return 'invalid container name';
  }

  return undefined;
}

const getAppInstances = (appStatuses: AppStatus[], formula: Formula) => {
  return appStatuses.filter(
    (appStatus) => appStatus.formula.name === formula.name
  );
};

// TODO: use formprops and formikprops types
export default function AppForm({ app, isReadOnly }: AppFormProps) {
  const { data } = app;
  const fieldNames = Object.keys(data);
  const apps = useAppStatus();

  const dependencyFormElements = app.dependencies?.map((dependency, index) => {
    const dependencyInstances = getAppInstances(
      apps.allAppStatus.status,
      dependency
    );
    const fieldName = dependency.name;
    const fieldId = `${fieldName}-field`;

    return (
      <Box key={index}>
        <Field name={fieldName} validate={requiredValidator(fieldName)}>
          {({ field, form }: { field: any; form: any }) => (
            <FormControl
              isInvalid={form.errors[fieldName] && form.touched[fieldName]}
            >
              <FormLabel htmlFor={fieldId}>
                <Image
                  src={dependency.logo}
                  height="5"
                  display="inline"
                  mr={1}
                />
                {`${dependency.name} Instance`}
              </FormLabel>
              <Select
                isDisabled={isReadOnly}
                placeholder={`Choose a ${dependency.name} instance`}
                id={fieldId}
                {...field}
              >
                {dependencyInstances.map((dependencyInstance, index) => (
                  <option key={index} value={dependencyInstance.name}>
                    {dependencyInstance.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{form.errors[fieldName]}</FormErrorMessage>
            </FormControl>
          )}
        </Field>
      </Box>
    );
  });

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
      if (fieldName === 'name') {
        validator = validateAppName;
      } else {
        validator = requiredValidator(fieldName);
      }
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
              <Flex alignItems="center">
                <FormLabel paddingRight={1} htmlFor={fieldId}>
                  {keyToLabelText(fieldName)}
                </FormLabel>
                {data[fieldName].hint && (
                  <Tooltip
                    zIndex={9999}
                    aria-label="hint for label"
                    hasArrow
                    label={data[fieldName].hint}
                    placement="top"
                  >
                    <Icon size="12px" name="info" />
                  </Tooltip>
                )}
              </Flex>
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
                    onChange={(evt: ChangeEvent<HTMLInputElement>) => {
                      if (evt.target.value.match(/^[0-9]*$/))
                        form.setFieldValue(field.name, evt.target.value);
                    }}
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
          <AccordionButton pl={1} pr={1}>
            <Box flex={1} textAlign="left">
              Basic
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel p={1}>
            <Stack spacing={2}>
              <Box>
                <FormControl>
                  <FormLabel htmlFor="image">Image</FormLabel>
                  <Input id="image" value={app.image} isDisabled={true} />
                </FormControl>
              </Box>
              {dependencyFormElements}
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
          <AccordionButton pl={1} pr={1}>
            <Box flex={1} textAlign="left">
              Advanced
            </Box>
            <AccordionIcon />
          </AccordionButton>
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
                                        onChange={(
                                          evt: ChangeEvent<HTMLInputElement>
                                        ) => {
                                          if (
                                            evt.target.value.match(/^[0-9]*$/)
                                          )
                                            form.setFieldValue(
                                              field.name,
                                              evt.target.value
                                            );
                                        }}
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
                                      icon={<DeleteIcon />}
                                      colorScheme={'red'}
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
                      colorScheme="blue"
                      mt={2}
                      leftIcon={<AddIcon />}
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

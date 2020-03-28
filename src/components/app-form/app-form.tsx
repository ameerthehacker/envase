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
  NumberDecrementStepper
} from '@chakra-ui/core';
import { capitalize } from '../../utils/utils';

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
  const fields = Object.keys(data);

  const formElements = fields.map((field, index) => {
    const type = data[field].type;
    const isInputField = type === 'string' || type === 'password';
    const isNumberField = type === 'number';

    return (
      <Box key={index}>
        <FormLabel htmlFor={`${field}-field`}>{capitalize(field)}</FormLabel>
        {isInputField && (
          <Input
            type={getInputType(type)}
            id={`${field}-field`}
            placeholder={data[field].description}
          />
        )}
        {isNumberField && (
          <NumberInput>
            <NumberInputField
              id={`${field}-field`}
              placeholder={data[field].description}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        )}
      </Box>
    );
  });

  return <Stack spacing={2}>{formElements}</Stack>;
}

import React from 'react';
import { Formula } from '../../contracts/formula';
import { Box, FormLabel, Input, Stack } from '@chakra-ui/core';
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
    const inputElementType = getInputType(data[field].type);

    return (
      <Box key={index}>
        <FormLabel htmlFor={`${field}-field`}>{capitalize(field)}</FormLabel>
        <Input
          type={inputElementType}
          id={`${field}-field`}
          placeholder={data[field].description}
        />
      </Box>
    );
  });

  return <Stack spacing={2}>{formElements}</Stack>;
}

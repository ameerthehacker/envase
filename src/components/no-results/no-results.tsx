import React from 'react';
import { Stack, Box, Text } from '@chakra-ui/core';
import { FaTable } from 'react-icons/fa';

export interface NoResultsProps {
  height: string;
}

export default function NoResults({ height }: NoResultsProps) {
  return (
    <Stack
      spacing={2}
      width="100%"
      alignItems="center"
      justifyContent="center"
      height={height}
    >
      <Box fontSize="6xl" as={FaTable} />
      <Text fontSize="xl" fontWeight="light">
        Sorry, nothing matched
      </Text>
    </Stack>
  );
}

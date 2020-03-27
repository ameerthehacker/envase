import React from 'react';
import { Stack, Text, Box, Button } from '@chakra-ui/core';
import { FaBoxOpen } from 'react-icons/fa';

export interface EmptyStateProps {
  onCreateClick: () => void;
}

export default function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <Stack
      spacing={2}
      height="calc(100vh - 60px)"
      width="100%"
      alignItems="center"
      justifyContent="center"
    >
      <Box fontSize="6xl" as={FaBoxOpen} />
      <Text fontSize="xl" fontWeight="light">
        No apps available!
      </Text>
      <Button onClick={onCreateClick} variantColor="blue">
        Create
      </Button>
    </Stack>
  );
}

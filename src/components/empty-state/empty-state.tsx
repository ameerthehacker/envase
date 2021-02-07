import React from 'react';
import { Stack, Text, Box, Button } from '@chakra-ui/react';
import { FaBoxOpen } from 'react-icons/fa';

export interface EmptyStateProps {
  onCreateClick: () => void;
  height: string;
}

export default function EmptyState({ onCreateClick, height }: EmptyStateProps) {
  return (
    <Stack
      spacing={2}
      width="100%"
      alignItems="center"
      justifyContent="center"
      height={height}
    >
      <Box fontSize="6xl" as={FaBoxOpen} />
      <Text fontSize="xl" fontWeight="light">
        No apps available!
      </Text>
      <Button onClick={onCreateClick} colorScheme="blue">
        Create
      </Button>
    </Stack>
  );
}

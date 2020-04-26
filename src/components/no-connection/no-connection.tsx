import React from 'react';
import { Stack, Box, Text, Button } from '@chakra-ui/core';
import { FaSkullCrossbones } from 'react-icons/fa';

export interface NoConnectionProps {
  onUpdateDockerSettingsClick: () => void;
}

export default function NoConnection({
  onUpdateDockerSettingsClick
}: NoConnectionProps) {
  return (
    <Stack
      height="calc(100vh - 60px)"
      alignItems="center"
      justifyContent="center"
    >
      <Stack alignItems="center" spacing={3}>
        <Box as={FaSkullCrossbones} size="xs" />
        <Text fontSize="2xl" fontWeight="light">
          Sorry, unable to connect to docker!
        </Text>
        <Button onClick={onUpdateDockerSettingsClick} variantColor="orange">
          Update Docker Settings
        </Button>
      </Stack>
    </Stack>
  );
}

import React from 'react';
import { Stack, Box, Text, Button } from '@chakra-ui/core';
import { FaSkullCrossbones } from 'react-icons/fa';

export interface NoConnectionProps {
  isRetrying: boolean;
  onPreferencesClick: () => void;
  onRetryClick: () => void;
}

export default function NoConnection({
  onPreferencesClick,
  onRetryClick,
  isRetrying
}: NoConnectionProps) {
  return (
    <Stack height="100vh" alignItems="center" justifyContent="center">
      <Stack alignItems="center" spacing={5}>
        <Box as={FaSkullCrossbones} size="xs" />
        <Box>
          <Text fontSize="2xl" fontWeight="light">
            Sorry, unable to connect to docker!
          </Text>
        </Box>
        <Box>
          <Stack direction="row">
            <Button
              isLoading={isRetrying}
              loadingText="Retrying..."
              onClick={onRetryClick}
              leftIcon="repeat"
              variantColor="green"
            >
              Retry
            </Button>
            <Button
              leftIcon="settings"
              onClick={onPreferencesClick}
              variantColor="orange"
            >
              Preferences
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
}

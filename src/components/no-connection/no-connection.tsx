import React from 'react';
import { Stack, Box, Text, Button } from '@chakra-ui/react';
import { FaSadTear } from 'react-icons/fa';
import { RepeatIcon, SettingsIcon } from '@chakra-ui/icons';

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
        <Box as={FaSadTear} size="xs" />
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
              leftIcon={<RepeatIcon />}
              colorScheme="green"
            >
              Retry
            </Button>
            <Button
              leftIcon={<SettingsIcon />}
              onClick={onPreferencesClick}
              colorScheme="orange"
            >
              Preferences
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
}

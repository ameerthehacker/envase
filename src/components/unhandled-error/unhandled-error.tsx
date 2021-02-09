import React from 'react';
import { Stack, Box, Text, Button } from '@chakra-ui/react';
import { FaSadCry } from 'react-icons/fa';
import { open } from '../../services/native/native';

interface UnhandledErrorProps {
  componentStack: string;
  error?: Error;
  resetError: () => any;
}

export default function UnhandledError({
  error,
  componentStack
}: UnhandledErrorProps) {
  return (
    <Stack height="100vh" alignItems="center" justifyContent="center">
      <Stack alignItems="center" spacing={5}>
        <Box as={FaSadCry} size="xs" />
        <Box>
          <Text fontSize="2xl" fontWeight="light">
            Sorry, something went wrong!
          </Text>
        </Box>
        <Box>
          <Button
            onClick={() => {
              const issueBody = `${error}${componentStack}`;
              const issueLink = encodeURI(
                `https://github.com/ameerthehacker/envase/issues/new?title=Unhandled Error&body=${issueBody}`
              );

              open(issueLink);
            }}
            colorScheme="orange"
          >
            Report Issue
          </Button>
        </Box>
      </Stack>
    </Stack>
  );
}

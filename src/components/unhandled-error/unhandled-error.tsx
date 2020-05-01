import React, { Component, ErrorInfo } from 'react';
import { Stack, Box, Text, Button } from '@chakra-ui/core';
import { FaSadCry } from 'react-icons/fa';
import { open } from '../../services/native/native';

interface UnhandledErrorState {
  hasError: boolean;
  error?: Error;
}

export default class UnhandledError extends Component<{}, UnhandledErrorState> {
  private errorInfo: any;

  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.errorInfo = errorInfo;
  }

  render() {
    if (this.state.hasError) {
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
                  const issueBody = `${this.state.error}${this.errorInfo.componentStack}`;
                  const issueLink = encodeURI(
                    `https://github.com/ameerthehacker/envase/issues/new?title=Unhandled Error&body=${issueBody}`
                  );

                  open(issueLink);
                }}
                variantColor="orange"
              >
                Report Issue
              </Button>
            </Box>
          </Stack>
        </Stack>
      );
    }

    return this.props.children;
  }
}

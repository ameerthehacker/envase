import React, { Component, ErrorInfo } from 'react';
import { Stack, Box, Text, Button } from '@chakra-ui/core';
import { FaSadCry } from 'react-icons/fa';
import { open } from '../../services/native';

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
          <Stack alignItems="center" spacing={3}>
            <Box as={FaSadCry} size="xs" />
            <Text fontSize="4xl">Sorry, something went wrong!</Text>
            <Button
              onClick={() => {
                const issueBody = `${this.state.error}${this.errorInfo.componentStack}`;
                const issueLink = encodeURI(
                  `https://github.com/ameerthehacker/dockapp/issues/new?title=Unhandled Error&body=${issueBody}`
                );

                open(issueLink);
              }}
              variantColor="orange"
            >
              Report Issue
            </Button>
          </Stack>
        </Stack>
      );
    }

    return this.props.children;
  }
}

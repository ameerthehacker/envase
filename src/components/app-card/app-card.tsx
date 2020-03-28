import React from 'react';
import { Box, Text, Stack, Button } from '@chakra-ui/core';

export interface AppCardProps {
  name: string;
  logo: string;
  onCreateClick: () => void;
}

export default function AppCard({ name, logo, onCreateClick }: AppCardProps) {
  return (
    <Box borderRadius={5} p={4} borderWidth="1px" boxShadow="md">
      <Stack spacing={3}>
        <Box height="100px">
          <img
            width="100px"
            src={logo}
            alt="app-logo"
            style={{
              objectFit: 'cover'
            }}
          />
        </Box>
        <Text>{name}</Text>
        <Button variantColor="green" onClick={onCreateClick}>
          Create
        </Button>
      </Stack>
    </Box>
  );
}

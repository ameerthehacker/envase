import React from 'react';
import { Box, Text, Stack, Button } from '@chakra-ui/core';

export interface AppCardProps {
  name: string;
  logo: string;
}

export default function AppCard({ name, logo }: AppCardProps) {
  return (
    <Box borderRadius={5} p={4} borderWidth="1px" boxShadow="md">
      <Stack spacing={3}>
        <Box>
          <img
            src={logo}
            width="100px"
            alt="app-logo"
            style={{
              objectFit: 'cover'
            }}
          />
        </Box>
        <Text>{name}</Text>
        <Button variantColor="green">Create</Button>
      </Stack>
    </Box>
  );
}

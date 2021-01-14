import React, { ReactNode } from 'react';
import { Box, Text, Stack } from '@chakra-ui/core';

export interface AppInfoCardProps {
  name: string;
  logo: string;
  children?: ReactNode;
}

export default function AppInfoCard({
  name,
  logo,
  children
}: AppInfoCardProps) {
  return (
    <Box
      minWidth="142px"
      borderRadius={5}
      p={4}
      borderWidth="1px"
      boxShadow="md"
    >
      <Stack alignItems="center" spacing={3}>
        <Box height="100px">
          <img
            width="90px"
            src={logo}
            alt="app-logo"
            style={{
              objectFit: 'cover'
            }}
          />
        </Box>
        <Text>{name}</Text>
        {children}
      </Stack>
    </Box>
  );
}

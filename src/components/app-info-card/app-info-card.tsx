import React, { ReactNode } from 'react';
import { Box, Text, Stack, Flex, Badge } from '@chakra-ui/core';

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
      borderRadius={5}
      p={4}
      borderWidth="1px"
      boxShadow="md"
      maxWidth="280px"
    >
      <Stack alignItems="center" spacing={3}>
        <Flex justifyContent="center" minHeight="160px" width="100%">
          <img
            width="120px"
            src={logo}
            alt="app-logo"
            style={{
              objectFit: 'contain'
            }}
          />
        </Flex>
        <Text fontSize="2xl" fontWeight="bolder">
          {name}
        </Text>
        <Badge variantColor="green" variant="subtle">
          Database
        </Badge>
        <Text textAlign="center" fontSize="sm">
          Apache is a free and open-source cross-platform web server software
        </Text>
        <Box mt={1}>{children}</Box>
      </Stack>
    </Box>
  );
}

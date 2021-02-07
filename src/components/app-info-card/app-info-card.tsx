import React, { ReactNode } from 'react';
import { Box, Text, Stack, Flex, Badge } from '@chakra-ui/core';

export interface AppTag {
  variant: 'solid' | 'outline';
  variantColor: string;
  text: string;
}
export interface AppInfoCardProps {
  name: string;
  logo: string;
  description?: string;
  children?: ReactNode;
  tags?: AppTag[];
}

export default function AppInfoCard({
  name,
  logo,
  description,
  children,
  tags
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
        {tags &&
          tags.map((tag, index) => (
            <Badge
              key={index}
              variant={tag.variant}
              variantColor={tag.variantColor}
            >
              {tag.text}
            </Badge>
          ))}
        {description && (
          <Text textAlign="center" fontSize="sm">
            {description}
          </Text>
        )}
        <Box mt={1}>{children}</Box>
      </Stack>
    </Box>
  );
}

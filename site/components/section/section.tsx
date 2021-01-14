import { Box, Flex } from '@chakra-ui/core';
import { ReactNode } from 'react';

type SectionProps = { children: ReactNode; bg: string; id?: string };

export default function Section({ children, bg, id }: SectionProps) {
  return (
    <Flex id={id} bg={bg} padding={6} justifyContent="center">
      <Box maxWidth="1100px" width="100%">
        {children}
      </Box>
    </Flex>
  );
}

import React from 'react';
import { Box, IconButton, useColorMode } from '@chakra-ui/core';

export default function Navbar() {
  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <Box p={2} width="auto" pos="fixed" right={0} top={0}>
      <IconButton
        opacity={0.65}
        fontSize="xl"
        variant="ghost"
        onClick={() => toggleColorMode()}
        icon={colorMode === 'light' ? 'moon' : 'sun'}
        aria-label="toggle-dark-mode"
      />
    </Box>
  );
}

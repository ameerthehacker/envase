import React from 'react';
import { Box, IconButton, useColorMode } from '@chakra-ui/core';

export default function Navbar() {
  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <Box width="auto" pos="fixed" right={0} top={0} borderWidth="1px">
      <IconButton
        onClick={() => toggleColorMode()}
        icon={colorMode === 'light' ? 'moon' : 'sun'}
        aria-label="toggle-dark-mode"
      />
    </Box>
  );
}

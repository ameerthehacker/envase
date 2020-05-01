import React from 'react';
import {
  Box,
  IconButton,
  useColorMode,
  Tooltip,
  useDisclosure,
  Flex
} from '@chakra-ui/core';
import { useApp } from '../../hooks/use-app/use-app';
import Preferences from '../../screens/preferences/preferences';
import Search from '../search/search';

export default function Navbar() {
  const { toggleColorMode, colorMode } = useColorMode();
  const { load } = useApp();
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <Flex p={2} width="auto" pos="fixed" right={0} top={0}>
      <Box mr={3}>
        <Tooltip label="Preferences" aria-label="Open preferences">
          <IconButton
            opacity={0.65}
            fontSize="xl"
            variant="ghost"
            icon="settings"
            onClick={onOpen}
            aria-label="Open preferences"
          />
        </Tooltip>
        <Tooltip label="Reload apps" aria-label="Reload apps">
          <IconButton
            opacity={0.65}
            fontSize="xl"
            variant="ghost"
            onClick={() => load()}
            icon="repeat"
            aria-label="reload-apps"
          />
        </Tooltip>
        <Tooltip
          label={`Turn lights ${colorMode === 'light' ? 'off' : 'on'}`}
          aria-label="toggle dark/light mode"
        >
          <IconButton
            opacity={0.65}
            fontSize="xl"
            variant="ghost"
            onClick={() => toggleColorMode()}
            icon={colorMode === 'light' ? 'moon' : 'sun'}
            aria-label="toggle-dark-mode"
          />
        </Tooltip>
        <Preferences isOpen={isOpen} onClose={onClose} />
      </Box>
      <Search onSearch={(s) => console.log(s)} />
    </Flex>
  );
}

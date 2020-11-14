import React from 'react';
import {
  Box,
  IconButton,
  useColorMode,
  Tooltip,
  useDisclosure,
  Flex,
  Button
} from '@chakra-ui/core';
import { useApp } from '../../hooks/use-app/use-app';
import Preferences from '../../screens/preferences/preferences';
import Search from '../search/search';
import { FaFilter } from 'react-icons/fa';

export interface NavbarProps {
  onFiltersClick: () => void;
  onSearch: (searchText: string) => void;
}

export default function Navbar({ onFiltersClick, onSearch }: NavbarProps) {
  const { toggleColorMode, colorMode } = useColorMode();
  const { load } = useApp();
  const {
    isOpen: isPreferencesOpen,
    onClose: onPreferencesClose,
    onOpen: onPreferencesOpen
  } = useDisclosure();

  return (
    <Flex p={2} width="auto" pos="fixed" right={0} top={0} zIndex={2}>
      <Box mr={3}>
        <Tooltip label="Filters" aria-label="Open preferences">
          <Button
            onClick={onFiltersClick}
            opacity={0.65}
            variant="ghost"
            aria-label="Open filters"
          >
            <Box as={FaFilter} />
          </Button>
        </Tooltip>
        <Tooltip label="Preferences" aria-label="Open preferences">
          <IconButton
            opacity={0.65}
            fontSize="xl"
            variant="ghost"
            icon="settings"
            onClick={onPreferencesOpen}
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
      </Box>
      <Search onSearch={onSearch} />
      <Preferences isOpen={isPreferencesOpen} onClose={onPreferencesClose} />
    </Flex>
  );
}

import React from 'react';
import AppInfoCard, { AppInfoCardProps } from '../app-info-card/app-info-card';
import {
  Stack,
  Button,
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/core';
import { FaPlay, FaStop, FaWrench } from 'react-icons/fa';

export interface Option {
  text: string;
  value: string;
  shouldBeRunning?: boolean;
}

export interface AppStatucCardProps extends AppInfoCardProps {
  state: 'running' | 'stopped';
  inStateTransit?: boolean;
  isDeleting: boolean;
  onStartClick: () => void;
  onStopClick: () => void;
  actions: Option[];
  onActionClick: (actionValue: string) => void;
  onDeleteClick: () => void;
}

export default function AppStatusCard({
  name,
  logo,
  state,
  inStateTransit,
  onStartClick,
  onStopClick,
  actions,
  onActionClick,
  onDeleteClick,
  isDeleting
}: AppStatucCardProps) {
  return (
    <AppInfoCard name={name} logo={logo}>
      <Stack direction="row">
        {state === 'stopped' && (
          <Button
            isLoading={inStateTransit}
            onClick={onStartClick}
            variantColor="green"
            aria-label="start-app"
          >
            <Box as={FaPlay} />
          </Button>
        )}
        {state === 'running' && (
          <Button
            isLoading={inStateTransit}
            onClick={onStopClick}
            variantColor="red"
            aria-label="stop-app"
          >
            <Box as={FaStop} />
          </Button>
        )}
        <IconButton
          variantColor="red"
          onClick={onDeleteClick}
          icon="delete"
          isLoading={isDeleting}
          aria-label="delete-app"
          isDisabled={state === 'running'}
        />
        <Menu>
          <MenuButton as={Button} aria-label="action-button">
            <Box as={FaWrench} />
          </MenuButton>
          <MenuList>
            {actions.map((action, index) => (
              <MenuItem
                isDisabled={action.shouldBeRunning && state === 'stopped'}
                onClick={() => onActionClick(action.value)}
                key={index}
              >
                {action.text}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Stack>
    </AppInfoCard>
  );
}

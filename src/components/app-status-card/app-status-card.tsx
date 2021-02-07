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
  MenuItem,
  MenuGroup
} from '@chakra-ui/core';
import { FaPlay, FaStop, FaWrench } from 'react-icons/fa';
import { Action } from '../../contracts/action';
import { CustomAction } from '../../contracts/formula';

export interface AppStatucCardProps extends AppInfoCardProps {
  state: 'running' | 'stopped';
  inStateTransit?: boolean;
  isDeleting: boolean;
  onStartClick: () => void;
  onStopClick: () => void;
  actions: Action[];
  customActions?: CustomAction[];
  onActionClick: (actionValue: string) => void;
  onCustomActionClick?: (action: CustomAction) => void;
  onDeleteClick: () => void;
}

export default function AppStatusCard({
  name,
  logo,
  state,
  description,
  inStateTransit,
  onStartClick,
  onStopClick,
  actions,
  onActionClick,
  customActions,
  onCustomActionClick,
  onDeleteClick,
  isDeleting
}: AppStatucCardProps) {
  return (
    <AppInfoCard description={description} name={name} logo={logo}>
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
            <MenuGroup title="App">
              {actions.map((action, index) => (
                <MenuItem
                  isDisabled={action.shouldBeRunning && state === 'stopped'}
                  onClick={() => onActionClick(action.value)}
                  key={index}
                >
                  {action.icon && <Box mr={2} as={action.icon} />}
                  {action.text}
                </MenuItem>
              ))}
            </MenuGroup>
            {customActions && customActions.length > 0 && (
              <MenuGroup title="Actions">
                {customActions.map((action, index) => (
                  <MenuItem
                    isDisabled={action.shouldBeRunning && state === 'stopped'}
                    onClick={() =>
                      onCustomActionClick && onCustomActionClick(action)
                    }
                    key={index}
                  >
                    {action.icon && <Box mr={2} as={action.icon} />}
                    {action.text}
                  </MenuItem>
                ))}
              </MenuGroup>
            )}
          </MenuList>
        </Menu>
      </Stack>
    </AppInfoCard>
  );
}

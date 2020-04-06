import React from 'react';
import AppInfoCard, { AppInfoCardProps } from '../app-info-card/app-info-card';
import { Stack, Button, Box, IconButton } from '@chakra-ui/core';
import { FaPlay, FaStop } from 'react-icons/fa';

export interface AppStatucCardProps extends AppInfoCardProps {
  state: 'running' | 'stopped';
  inStateTransit?: boolean;
  isDeleting: boolean;
  onStartClick: () => void;
  onStopClick: () => void;
  onInfoClick: () => void;
  onDeleteClick: () => void;
}

export default function AppStatusCard({
  name,
  logo,
  state,
  inStateTransit,
  onStartClick,
  onStopClick,
  onInfoClick,
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
        <IconButton
          variantColor="orange"
          onClick={onInfoClick}
          icon="info"
          aria-label="info"
        />
      </Stack>
    </AppInfoCard>
  );
}

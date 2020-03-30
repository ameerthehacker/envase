import React from 'react';
import AppInfoCard, { AppInfoCardProps } from '../app-info-card/app-info-card';
import { Stack, Button, Box, IconButton } from '@chakra-ui/core';
import { FaPlay, FaStop } from 'react-icons/fa';

export interface AppStatucCardProps extends AppInfoCardProps {
  status: 'running' | 'stopped' | 'intransit';
  onStartClick: () => void;
  onStopClick: () => void;
  onInfoClick: () => void;
}

export default function AppStatusCard({
  name,
  logo,
  status,
  onStartClick,
  onStopClick,
  onInfoClick
}: AppStatucCardProps) {
  return (
    <AppInfoCard name={name} logo={logo}>
      <Stack direction="row">
        {status === 'stopped' && (
          <Button
            onClick={onStartClick}
            variantColor="green"
            aria-label="start-app"
          >
            <Box as={FaPlay} />
          </Button>
        )}
        {status === 'running' && (
          <Button
            onClick={onStopClick}
            variantColor="red"
            aria-label="stop-app"
          >
            <Box as={FaStop} />
          </Button>
        )}
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

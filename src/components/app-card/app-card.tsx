import React from 'react';
import { Button } from '@chakra-ui/core';
import AppInfoCard, { AppInfoCardProps } from '../app-info-card/app-info-card';

export interface AppCardProps extends AppInfoCardProps {
  onCreateClick: () => void;
  isDisabled?: boolean;
}

export default function AppCard({
  name,
  logo,
  isDisabled,
  onCreateClick
}: AppCardProps) {
  return (
    <AppInfoCard name={name} logo={logo}>
      <Button
        isDisabled={isDisabled}
        variantColor="green"
        onClick={onCreateClick}
      >
        Create
      </Button>
    </AppInfoCard>
  );
}

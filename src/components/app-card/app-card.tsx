import React from 'react';
import AppInfoCard from '../app-info-card/app-info-card';
import { Button } from '@chakra-ui/core';
export interface AppCardProps {
  name: string;
  logo: string;
  onCreateClick: () => void;
}

export default function AppCard({ name, logo, onCreateClick }: AppCardProps) {
  return (
    <AppInfoCard name={name} logo={logo}>
      <Button variantColor="green" onClick={onCreateClick}>
        Create
      </Button>
    </AppInfoCard>
  );
}

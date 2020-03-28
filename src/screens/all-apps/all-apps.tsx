import React from 'react';
import { Formula } from '../../contracts/formula';
import { Stack } from '@chakra-ui/core';
import AppCard from '../../components/app-card/app-card';

export interface AllAppsProps {
  apps: Formula[];
}

export default function AllApps({ apps }: AllAppsProps) {
  return (
    <Stack direction="row">
      {apps.map((app, index) => (
        <AppCard key={index} name={app.name} logo={app.logo} />
      ))}
    </Stack>
  );
}

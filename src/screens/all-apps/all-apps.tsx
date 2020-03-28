import React, { useState } from 'react';
import { Formula } from '../../contracts/formula';
import { Stack, useDisclosure, Box } from '@chakra-ui/core';
import AppCard from '../../components/app-card/app-card';
import AppFormModal from '../../components/app-form-modal/app-form-modal';

export interface AllAppsProps {
  apps: Formula[];
}

export default function AllApps({ apps }: AllAppsProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedApp, setSelectedApp] = useState<Formula>();

  return (
    <Stack direction="row">
      {apps.map((app, index) => (
        <Box key={index}>
          <AppCard
            onCreateClick={() => {
              setSelectedApp(apps[index]);
              onOpen();
            }}
            name={app.name}
            logo={app.logo}
          />
        </Box>
      ))}
      {/* modal to get app details like name, port etc. */}
      <AppFormModal app={selectedApp} isOpen={isOpen} onClose={onClose} />
    </Stack>
  );
}

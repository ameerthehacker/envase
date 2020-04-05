import React, { useState } from 'react';
import { Formula } from '../../contracts/formula';
import { Stack, useDisclosure, Box, useToast } from '@chakra-ui/core';
import AppFormModal from '../../components/app-form-modal/app-form-modal';
import AppCard from '../../components/app-card/app-card';
import { checkImageExistence } from '../../services/docker';

export interface AllAppsProps {
  apps: Formula[];
}

export default function AllApps({ apps }: AllAppsProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedApp, setSelectedApp] = useState<Formula>();
  const [isValidating, setIsValidating] = useState(false);
  const toast = useToast();

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
      <AppFormModal
        isValidating={isValidating}
        app={selectedApp}
        isOpen={isOpen}
        onSubmit={async (values) => {
          setIsValidating(true);

          if (selectedApp) {
            const { image } = selectedApp;
            const { version } = values;

            const {
              errorWhileChecking,
              exists,
              availableLocally
            } = await checkImageExistence(image, version);

            if (!errorWhileChecking && exists) {
              // the image is available locally
              if (availableLocally) {
                console.log('Creating container...');
              } else {
                console.log('Pulling image...');
              }
            } else if (!errorWhileChecking && !exists) {
              toast({
                title: 'Error',
                description: `Image ${image} with tag ${version} does not exists`,
                isClosable: true,
                status: 'error'
              });
            } else if (errorWhileChecking) {
              toast({
                title: 'Error',
                description: `Image ${image} with tag ${version} does not exist locally and you are offline`,
                isClosable: true,
                status: 'error'
              });
            }

            setIsValidating(false);
          }
        }}
        onClose={() => {
          onClose();
          setIsValidating(false);
        }}
      />
    </Stack>
  );
}

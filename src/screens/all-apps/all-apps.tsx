import React, { useState } from 'react';
import { Formula } from '../../contracts/formula';
import { Stack, useDisclosure, Box, useToast } from '@chakra-ui/core';
import AppFormModal from '../../components/app-form-modal/app-form-modal';
import AppCard from '../../components/app-card/app-card';
import { dockerode, ipcRenderer } from '../../services/native';
import { IPC_CHANNELS } from '../../constants';
import { IpcRendererEvent } from 'electron';

const { CHECK_IMAGE_EXISTS } = IPC_CHANNELS;

export interface AllAppsProps {
  apps: Formula[];
}

interface CheckImageExistsReponse {
  error: boolean | string;
  exists: boolean;
}

function doesImageExists(
  image: string,
  tag: string
): Promise<CheckImageExistsReponse> {
  ipcRenderer.send(CHECK_IMAGE_EXISTS, { image, tag });

  return new Promise((resolve) => {
    const listener = (evt: IpcRendererEvent, args: CheckImageExistsReponse) => {
      resolve(args);

      ipcRenderer.removeListener(CHECK_IMAGE_EXISTS, listener);
    };

    ipcRenderer.on(CHECK_IMAGE_EXISTS, listener);
  });
}

export default function AllApps({ apps }: AllAppsProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedApp, setSelectedApp] = useState<Formula>();
  const [isProcessing, setIsProcessing] = useState(false);
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
        isValidating={isProcessing}
        app={selectedApp}
        isOpen={isOpen}
        onSubmit={(values) => {
          setIsProcessing(true);

          if (selectedApp) {
            dockerode
              .getImage(`${selectedApp.image}:${values.version}`)
              .inspect()
              .then(() => {
                // the image is available locally so we can create the container
                console.log('Hurray!');
              })
              .catch(() => {
                doesImageExists(selectedApp.image, values.version)
                  .then(({ error, exists }) => {
                    if (!error && !exists) {
                      toast({
                        title: 'Error',
                        description: `Image ${selectedApp.image} with tag ${values.version} does not exists`,
                        isClosable: true,
                        status: 'error'
                      });
                    } else if (error) {
                      toast({
                        title: 'Error',
                        description: `Image ${selectedApp.image} with tag ${values.version} does not exist locally and you are offline`,
                        isClosable: true,
                        status: 'error'
                      });
                    } else {
                      // the image is not available locally so we need to pull it
                    }
                  })
                  .finally(() => setIsProcessing(false));
              });
          }
        }}
        onClose={() => {
          onClose();
          setIsProcessing(false);
        }}
      />
    </Stack>
  );
}

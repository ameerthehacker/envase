import React, { useState, useRef } from 'react';
import { Formula } from '../../contracts/formula';
import { Stack, useDisclosure, Box, useToast } from '@chakra-ui/core';
import AppFormModal, {
  AppFormResult
} from '../../components/app-form-modal/app-form-modal';
import AppCard from '../../components/app-card/app-card';
import {
  checkImageExistence,
  pullImage,
  PullProgressEvent,
  DockerStream,
  createContainerFromApp
} from '../../services/docker';
import ProgressModal from '../../components/progress-modal/progress-modal';
import { useLoadApps } from '../../hooks/use-load-apps/use-load-apps';

export interface AllAppsProps {
  apps: Formula[];
}

export default function AllApps({ apps }: AllAppsProps) {
  const {
    isOpen: isFormOpen,
    onClose: onFormClose,
    onOpen: onFormOpen
  } = useDisclosure();
  const {
    isOpen: isProgressOpen,
    onClose: onProgressClose,
    onOpen: onProgressOpen
  } = useDisclosure();
  const [selectedApp, setSelectedApp] = useState<Formula>();
  const [isValidating, setIsValidating] = useState(false);
  const [pullProgress, setPullProgress] = useState<
    Record<string, PullProgressEvent>
  >();
  const toast = useToast();
  const appFormResult = useRef<AppFormResult>();
  const currentStream = useRef<DockerStream>();
  const loadApps = useLoadApps();

  function createNewApp(values: AppFormResult, app: Formula) {
    createContainerFromApp(values, app)
      .then(() => {
        toast({
          title: 'Done',
          description: `A new ${app.name} has been created you can start it in My Apps section`,
          status: 'success'
        });
      })
      .catch((err) => {
        toast({
          title: `Error creating ${app.name} app`,
          description: err,
          status: 'error'
        });
      })
      .finally(() => loadApps());
  }

  return (
    <Stack direction="row">
      {apps.map((app, index) => (
        <Box key={index}>
          <AppCard
            onCreateClick={() => {
              setSelectedApp(apps[index]);
              onFormOpen();
            }}
            name={app.name}
            logo={app.logo}
          />
        </Box>
      ))}
      {/* modal to show image pull progress */}
      <ProgressModal
        tag={appFormResult.current?.version || ''}
        image={selectedApp?.image || ''}
        isOpen={isProgressOpen}
        onClose={() => {
          onProgressClose();
          currentStream.current?.destroy();
        }}
        progress={pullProgress}
      />
      {/* modal to get app details like name, port etc. */}
      <AppFormModal
        isValidating={isValidating}
        app={selectedApp}
        isOpen={isFormOpen}
        onSubmit={async (values) => {
          setIsValidating(true);

          if (selectedApp) {
            appFormResult.current = values;

            const { image } = selectedApp;
            const { version } = values;
            const {
              errorWhileChecking,
              exists,
              availableLocally
            } = await checkImageExistence(image, version);

            if (!errorWhileChecking && exists) {
              onFormClose();
              // the image is available locally
              if (availableLocally) {
                createNewApp(values, selectedApp);
              } else {
                onProgressOpen();

                const stream = await pullImage(
                  image,
                  version,
                  (evt) => {
                    setPullProgress((pullProgress) => ({
                      ...pullProgress,
                      [evt.id]: {
                        ...evt
                      }
                    }));
                  },
                  () => {
                    onProgressClose();
                    // clear the previous progress messages
                    setPullProgress(undefined);

                    if (
                      currentStream.current &&
                      !currentStream.current.aborted
                    ) {
                      createNewApp(values, selectedApp);
                    } else {
                      console.log('aborted');
                    }
                  }
                );

                currentStream.current = stream;
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
          onFormClose();
          setIsValidating(false);
        }}
      />
    </Stack>
  );
}

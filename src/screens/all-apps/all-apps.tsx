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
  createContainerFromApp,
  getAppsWithName
} from '../../services/docker/docker';
import ProgressModal from '../../components/progress-modal/progress-modal';
import { useAppStatus } from '../../contexts/app-status/app-status';
import { useApp } from '../../hooks/use-app/use-app';
import { Category } from '../../contracts/category';
import NoResults from '../../components/no-results/no-results';

export interface AllAppsProps {
  apps: Formula[];
  searchText?: string;
  selectedCategories?: Category;
}

export default function AllApps({
  apps,
  selectedCategories,
  searchText
}: AllAppsProps) {
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
  const { allAppStatus } = useAppStatus();
  const { load } = useApp();

  function createNewApp(values: AppFormResult, app: Formula) {
    createContainerFromApp(values, app)
      .then(() => {
        toast({
          title: 'Done',
          description: `A new ${app.name} has been created, you can start it in My Apps section`,
          status: 'success'
        });
      })
      .catch((err) => {
        toast({
          title: `Error creating ${app.name} app`,
          description: `${err}`,
          status: 'error'
        });
      })
      .finally(() => load());
  }

  const filteredApps = apps
    .filter((app) => {
      if (!searchText) return true;
      else return app.name.toLowerCase().includes(searchText.toLowerCase());
    })
    .filter((app) =>
      app.tags?.find((tag) => {
        if (!selectedCategories) return true;
        else return selectedCategories[tag];
      })
    );

  return (
    <>
      {filteredApps.length === 0 && <NoResults height="calc(100vh - 90px)" />}
      {filteredApps.length > 0 && (
        <Stack direction="row" flexWrap="wrap">
          {filteredApps.map((app, index) => (
            <Box key={index} marginTop={4}>
              <AppCard
                isDisabled={allAppStatus.error !== undefined}
                onCreateClick={() => {
                  setSelectedApp(filteredApps[index]);
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
              // clear the previous progress messages
              setPullProgress(undefined);
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

                const { name } = values;
                const appsWithSameName = await getAppsWithName(name);

                // there is already an app with same name
                if (appsWithSameName.length > 0) {
                  toast({
                    title: 'Sorry!',
                    description: 'There is already an app with same name',
                    status: 'error',
                    isClosable: true
                  });
                  setIsValidating(false);

                  return;
                }

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
      )}
    </>
  );
}

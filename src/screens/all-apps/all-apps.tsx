import React, { useRef, useState } from 'react';
import { Formula } from '../../contracts/formula';
import {
  Box,
  Flex,
  SimpleGrid,
  useDisclosure,
  useToast
} from '@chakra-ui/core';
import AppFormModal, {
  AppFormResult
} from '../../components/app-form-modal/app-form-modal';
import AppCard from '../../components/app-card/app-card';
import {
  checkImageExistence,
  createContainerFromApp,
  DockerStream,
  getAppsWithName,
  pullImage,
  PullProgressEvent
} from '../../services/docker/docker';
import ProgressModal from '../../components/progress-modal/progress-modal';
import { useAppStatus } from '../../contexts/app-status/app-status';
import { useApp } from '../../hooks/use-app/use-app';
import { Category } from '../../contracts/category';
import NoResults from '../../components/no-results/no-results';
import { AppTag } from '../../components/app-info-card/app-info-card';

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

  function generateTags(app: Formula): AppTag[] | undefined {
    return app.tags?.map((tag) => {
      if (tag === 'Application') {
        return {
          variantColor: 'green',
          text: 'Application',
          variant: 'solid'
        };
      } else if (tag === 'Database') {
        return {
          variantColor: 'orange',
          text: 'Database',
          variant: 'solid'
        };
      } else if (tag === 'Language') {
        return {
          variantColor: 'yellow',
          text: 'Language',
          variant: 'solid'
        };
      } else if (tag === 'OS') {
        return {
          variantColor: 'indigo',
          text: 'OS',
          variant: 'solid'
        };
      } else if (tag === 'Platform') {
        return {
          variantColor: 'teal',
          text: 'Platform',
          variant: 'solid'
        };
      } else {
        return {
          variantColor: 'orange',
          text: tag,
          variant: 'solid'
        };
      }
    });
  }

  function createNewApp(values: AppFormResult, app: Formula) {
    createContainerFromApp(values, app)
      .then(() => {
        toast({
          title: 'Done',
          description: `A new ${app.name} has been created, you can start it in My Apps section`,
          status: 'success',
          isClosable: true
        });
      })
      .catch((err) => {
        toast({
          title: `Error creating ${app.name} app`,
          description: `${err}`,
          status: 'error',
          isClosable: true
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
        <Flex justifyContent="center">
          <SimpleGrid
            mt={4}
            display="inline-grid"
            columns={{ sm: 2, md: 3, lg: 4 }}
            spacing={2}
          >
            {filteredApps.map((app, index) => (
              <Box minWidth="150px" maxWidth="280px" key={index}>
                <AppCard
                  isDisabled={allAppStatus.error !== undefined}
                  onCreateClick={() => {
                    setSelectedApp(filteredApps[index]);
                    onFormOpen();
                  }}
                  isLoading={allAppStatus.isFetching}
                  name={app.name}
                  logo={app.logo}
                  description={app.description}
                  website={app.website}
                  tags={generateTags(app)}
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

                      currentStream.current = await pullImage(
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
          </SimpleGrid>
        </Flex>
      )}
    </>
  );
}

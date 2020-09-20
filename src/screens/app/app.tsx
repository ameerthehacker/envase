import React, { useState, useEffect, ReactNode, useMemo } from 'react';
import Navbar from '../../components/navbar/navbar';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Box,
  useDisclosure,
  useToast,
  Text,
  List,
  ListItem,
  ListIcon,
  Stack
} from '@chakra-ui/core';
import { FaListUl, FaRocket } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import { IconText } from '../../components/icon-text/icon-text';
import EmptyState from '../../components/empty-state/empty-state';
import AllApps, { AllAppsProps } from '../all-apps/all-apps';
import { FORMULAS } from '../../formulas';
import { useAppStatus } from '../../contexts/app-status/app-status';
import MyApps, { MyAppsProps } from '../my-apps/my-apps';
import { useApp } from '../../hooks/use-app/use-app';
import AppCardSkeleton from '../../components/app-card-skeleton/app-card-skeleton';
import NoConnection from '../../components/no-connection/no-connection';
import './app.scss';
import Preferences from '../preferences/preferences';
import { ipcRenderer } from '../../services/native/native';
import { IPC_CHANNELS, ENVASE_NET } from '../../constants';
import withFilters from '../../hoc/with-filters';
import ConfirmDialogModal from '../../components/confirm-dialog-modal/confirm-dialog-modal';
import { getReleaseNotes } from '../../utils/utils';
import { createEnvaseNetwork } from '../../services/docker/docker';

const { SAVE_SETTINGS, CHECK_FOR_UPDATE, INSTALL_UPDATE } = IPC_CHANNELS;
const AllAppsWithFilters = withFilters<AllAppsProps>(AllApps);
const MyAppsWithFilters = withFilters<MyAppsProps>(MyApps);

export default function App() {
  const [tabIndex, setTabIndex] = useState(0);
  const [searchText, setSearchText] = useState('');
  const { allAppStatus } = useAppStatus();
  const [updateDescription, setUpdateDescription] = useState<ReactNode>();
  const handleTabChange = (index: number) => {
    setTabIndex(index);
  };
  const { load } = useApp();
  const {
    isOpen: isPreferencesOpen,
    onClose: onPreferencesClose,
    onOpen: onPreferencesOpen
  } = useDisclosure();
  const toast = useToast();
  const {
    isOpen: isFiltersOpen,
    onClose: onFiltersClose,
    onOpen: onFiltersOpen
  } = useDisclosure();
  const {
    isOpen: isUpdateDialogOpen,
    onClose: onUpdateDialogClose,
    onOpen: onUpdateDialogOpen
  } = useDisclosure();
  const sortedFormulas = useMemo(
    () => FORMULAS.sort((x, y) => x.name.localeCompare(y.name)),
    [FORMULAS]
  );

  useEffect(() => {
    load(true).then(() => {
      createEnvaseNetwork().catch(() => {
        toast({
          title: 'Fatal Error',
          description: `Unable to create ${ENVASE_NET} network, try to restart envase or create the network manually!`,
          status: 'error',
          isClosable: true,
          duration: 5000
        });
      });
    });

    ipcRenderer.on(CHECK_FOR_UPDATE, (evt, info) => {
      if (info) {
        const { version, releaseNotes } = info;
        const changes = getReleaseNotes(releaseNotes);

        const updateDetails = (
          <Stack spacing={2}>
            <Text fontSize="1xl">Release Notes ({version})</Text>
            <List spacing={3}>
              {changes.map((change, key) => (
                <ListItem key={key}>
                  <ListIcon icon="check-circle" color="green.500" />
                  {change}
                </ListItem>
              ))}
            </List>
          </Stack>
        );

        setUpdateDescription(updateDetails);
        onUpdateDialogOpen();
      }
    });

    ipcRenderer.send(CHECK_FOR_UPDATE);

    ipcRenderer.on(SAVE_SETTINGS, () => {
      load();
    });
  }, [load, onUpdateDialogOpen, toast]);

  return (
    <>
      <Helmet>
        <title>Envase</title>
      </Helmet>
      {allAppStatus.error?.errno && (
        <>
          <NoConnection
            isRetrying={allAppStatus.isFetching}
            onRetryClick={() => {
              load(true).catch((err) => {
                toast({
                  title: 'Retry failed',
                  description: `${err}`,
                  isClosable: true,
                  status: 'error'
                });
              });
            }}
            onPreferencesClick={onPreferencesOpen}
          />
          <Preferences
            isOpen={isPreferencesOpen}
            onClose={onPreferencesClose}
          />
        </>
      )}
      {!allAppStatus.error?.errno && (
        <>
          <Navbar
            onSearch={setSearchText}
            onFiltersClick={() => {
              if (tabIndex === 0 && allAppStatus.status.length === 0) {
                toast({
                  title: 'Sorry',
                  status: 'info',
                  description: 'No apps are available to apply filters',
                  isClosable: true
                });
              } else {
                onFiltersOpen();
              }
            }}
          />
          <Tabs index={tabIndex} onChange={handleTabChange}>
            <TabList>
              <Tab p={4} className="no-box-shadow">
                <IconText icon={<Box as={FaRocket} />} text="My Apps" />
              </Tab>
              <Tab p={4} className="no-box-shadow">
                <IconText icon={<Box as={FaListUl} />} text="All Apps" />
              </Tab>
            </TabList>
            <TabPanels p={6} pb={0} pt={0}>
              <TabPanel>
                {allAppStatus.isFetching && <AppCardSkeleton count={3} />}
                {!allAppStatus.isFetching &&
                  !allAppStatus.error?.errno &&
                  allAppStatus.status.length === 0 && (
                    <EmptyState
                      height="calc(100vh - 90px)"
                      onCreateClick={() => setTabIndex(1)}
                    />
                  )}
                {!allAppStatus.isFetching && allAppStatus.status.length > 0 && (
                  <MyAppsWithFilters
                    allAppStatus={allAppStatus}
                    searchText={searchText}
                    isFiltersOpen={tabIndex === 0 && isFiltersOpen}
                    onFiltersClose={onFiltersClose}
                  />
                )}
              </TabPanel>
              <TabPanel>
                <AllAppsWithFilters
                  apps={sortedFormulas}
                  searchText={searchText}
                  isFiltersOpen={tabIndex === 1 && isFiltersOpen}
                  onFiltersClose={onFiltersClose}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </>
      )}
      <ConfirmDialogModal
        title="Update Available"
        size="lg"
        description={updateDescription}
        isOpen={isUpdateDialogOpen}
        onSubmit={(ok) => {
          if (ok) {
            ipcRenderer.send(INSTALL_UPDATE);
          }

          onUpdateDialogClose();
        }}
      />
    </>
  );
}

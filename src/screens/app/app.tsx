import React, { useState, useEffect } from 'react';
import Navbar from '../../components/navbar/navbar';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Box,
  useDisclosure,
  useToast
} from '@chakra-ui/core';
import { FaListUl, FaRocket } from 'react-icons/fa';
import { IconText } from '../../components/icon-text/icon-text';
import EmptyState from '../../components/empty-state/empty-state';
import AllApps from '../all-apps/all-apps';
import { FORMULAS } from '../../formulas';
import { useAppStatus } from '../../contexts/app-status/app-status';
import MyApps from '../my-apps/my-apps';
import { useLoadApps } from '../../hooks/use-load-apps/use-load-apps';
import AppCardSkeleton from '../../components/app-card-skeleton/app-card-skeleton';
import NoConnection from '../../components/no-connection/no-connection';
import './app.scss';
import Preferences from '../preferences/preferences';

export default function App() {
  const [tabIndex, setTabIndex] = useState(0);
  const { allAppStatus } = useAppStatus();
  const handleTabChange = (index: number) => {
    setTabIndex(index);
  };
  const loadApps = useLoadApps();
  const {
    isOpen: isPreferencesOpen,
    onClose: onPreferencesClose,
    onOpen: onPreferencesOpen
  } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    loadApps(true);
  }, [loadApps]);

  return (
    <>
      {allAppStatus.error?.errno === 'ECONNREFUSED' && (
        <>
          <NoConnection
            isRetrying={allAppStatus.isFetching}
            onRetryClick={() => {
              loadApps(true).catch((err) => {
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
      {allAppStatus.error?.errno !== 'ECONNREFUSED' && (
        <>
          <Navbar />
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
                  allAppStatus.error?.errno !== 'ECONNREFUSED' &&
                  allAppStatus.status.length === 0 && (
                    <EmptyState
                      height="calc(100vh - 90px)"
                      onCreateClick={() => setTabIndex(1)}
                    />
                  )}
                {!allAppStatus.isFetching && allAppStatus.status.length > 0 && (
                  <MyApps />
                )}
              </TabPanel>
              <TabPanel>
                <AllApps apps={FORMULAS} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </>
      )}
    </>
  );
}

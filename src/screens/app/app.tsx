import React, { useState, useEffect } from 'react';
import Navbar from '../../components/navbar/navbar';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Icon,
  Box
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

export default function App() {
  const [tabIndex, setTabIndex] = useState(0);
  const { allAppStatus } = useAppStatus();
  const handleTabChange = (index: number) => {
    setTabIndex(index);
  };
  const loadApps = useLoadApps();

  useEffect(() => {
    loadApps(true);
  }, [loadApps]);

  return (
    <>
      <Navbar />
      <Tabs index={tabIndex} onChange={handleTabChange}>
        <TabList>
          <Tab p={4}>
            <IconText icon={<Box as={FaRocket} />} text="My Apps" />
          </Tab>
          <Tab p={4}>
            <IconText icon={<Box as={FaListUl} />} text="All Apps" />
          </Tab>
          <Tab p={4}>
            <IconText icon={<Icon name="settings" />} text="Preferences" />
          </Tab>
        </TabList>
        <TabPanels p={6} pb={0} pt={0}>
          <TabPanel>
            {allAppStatus.error?.errno === 'ECONNREFUSED' && (
              <NoConnection
                onUpdateDockerSettingsClick={() => setTabIndex(2)}
              />
            )}
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
          <TabPanel>
            <p>settings!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

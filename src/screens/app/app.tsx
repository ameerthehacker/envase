import React, { useState } from 'react';
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

export default function App() {
  const [tabIndex, setTabIndex] = useState(1);

  const handleTabChange = (index: number) => {
    setTabIndex(index);
  };

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
        <TabPanels p={6} pb={0}>
          <TabPanel>
            <EmptyState
              height="calc(100vh - 90px)"
              onCreateClick={() => setTabIndex(1)}
            />
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

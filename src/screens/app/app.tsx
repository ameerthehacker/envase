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

export default function App() {
  const [tabIndex, setTabIndex] = useState(0);

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
        <TabPanels>
          <TabPanel>
            <EmptyState onCreateClick={() => setTabIndex(1)} />
          </TabPanel>
          <TabPanel>
            <p>all apps!</p>
          </TabPanel>
          <TabPanel>
            <p>settings!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

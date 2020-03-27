import React from 'react';
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

export default function App() {
  return (
    <>
      <Navbar />
      <Tabs>
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
          <TabPanel></TabPanel>
          <TabPanel></TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  shellOrExecIntoApp,
  getContainerAppInfo
} from '../../services/docker/docker';
import Terminal from '../../components/terminal/terminal';
import {
  Box,
  Flex,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast
} from '@chakra-ui/core';
import { parse } from 'query-string';
import { Helmet } from 'react-helmet';

export default function ShellIntoApp() {
  const { containerId } = useParams<{ containerId: string }>();
  const currentId = useRef(1);
  const [shellTabs, setShellTabs] = useState([
    {
      containerId,
      id: currentId.current
    }
  ]);
  const location = useLocation();
  const queryParams = parse(location.search);
  const cmd = Array.isArray(queryParams.cmd)
    ? queryParams.cmd[0]
    : queryParams.cmd;

  return (
    <Tabs size="sm" variant="enclosed">
      <Flex>
        <TabList>
          {shellTabs.map((shellTab, index) => (
            <Tab key={shellTab.id}>Shell {index + 1}</Tab>
          ))}
        </TabList>
        <IconButton
          onClick={(evt) => {
            currentId.current += 1;

            setShellTabs((tabs) => [
              ...tabs,
              { containerId, id: currentId.current }
            ]);
          }}
          size="sm"
          variant="ghost"
          aria-label="add-tab"
          icon="add"
        />
      </Flex>
      <TabPanels>
        {shellTabs.map((shellTab) => (
          <TabPanel key={shellTab.id}>
            <Shell cmd={cmd} containerId={containerId} />
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
}

type ShellProps = {
  containerId: string;
  cmd: string | null;
};

function Shell({ containerId, cmd }: ShellProps) {
  const toast = useToast();
  const [stream, setStream] = useState<NodeJS.ReadWriteStream>();
  const [appName, setAppName] = useState<string>();

  useEffect(() => {
    getContainerAppInfo(containerId).then((containerAppInfo) => {
      setAppName(containerAppInfo.formValues.name);
    });
    shellOrExecIntoApp(containerId, cmd)
      .then((exec) => {
        exec.start(
          { hijack: true, stdin: true, Tty: true },
          (err: any, stream: NodeJS.ReadWriteStream | undefined) => {
            setStream(stream);
          }
        );
      })
      .catch((err) => {
        toast({
          title: 'Unable to shell',
          description: `${err}`,
          status: 'error',
          isClosable: true
        });
      });
  }, [containerId, cmd, toast]);

  return (
    <>
      <Helmet>
        <title>{`Terminal${appName ? ` [${appName}]` : ''}`}</title>
      </Helmet>
      <Box height="calc(100vh - 29px)" bg="black">
        {stream && <Terminal stdin={true} stream={stream} />}
      </Box>
    </>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  shellOrExecIntoApp,
  getContainerAppInfo
} from '../../services/docker/docker';
import Terminal from '../../components/terminal/terminal';
import { Box, Flex, IconButton, Text, useToast } from '@chakra-ui/core';
import { parse } from 'query-string';
import { Helmet } from 'react-helmet';

type RouteParams = {
  containerId: string;
};

export default function ShellIntoApp() {
  const { containerId } = useParams<RouteParams>();
  const currentId = useRef(1);
  const [currentTab, setCurrentTab] = useState(0);
  const [appName, setAppName] = useState<string>();
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
  const allowTabs = queryParams.allowTabs;

  useEffect(() => {
    getContainerAppInfo(containerId).then((containerAppInfo) => {
      setAppName(containerAppInfo.formValues.name);
    });
  }, [containerId]);

  return (
    <Box>
      <Helmet>
        <title>{`Terminal${appName ? ` [${appName}]` : ''}`}</title>
      </Helmet>
      {allowTabs === 'yes' && (
        <Flex alignItems="center" overflowY="auto">
          {shellTabs.map((shellTab, index) => (
            <Flex
              minWidth={40}
              onClick={() => setCurrentTab(index)}
              bg={index === currentTab ? 'gray.800' : 'gray.900'}
              color={index === currentTab ? 'blue.300' : 'white'}
              cursor="pointer"
              py={2}
              borderWidth={1}
              borderLeftWidth={0}
              px={4}
              key={shellTab.id}
              alignItems="center"
              justifyContent="space-between"
            >
              <Text>{`${appName} [${shellTab.id}]`}</Text>
              {shellTabs.length > 1 && (
                <IconButton
                  onClick={(evt) => {
                    evt.stopPropagation();

                    setShellTabs((tabs) =>
                      tabs.filter((tab) => tab.id !== shellTab.id)
                    );

                    if (currentTab >= index)
                      setCurrentTab((currentTab) => currentTab - 1);
                  }}
                  ml={4}
                  aria-label="close"
                  icon="close"
                  size="xs"
                  variant="ghost"
                />
              )}
            </Flex>
          ))}
          <IconButton
            onClick={() => {
              currentId.current = currentId.current + 1;

              setShellTabs([
                ...shellTabs,
                { containerId, id: currentId.current }
              ]);
              setCurrentTab(shellTabs.length);
            }}
            aria-label="add-terminal"
            icon="add"
            variant="ghost"
          />
        </Flex>
      )}
      {shellTabs.map((shellTab, index) => (
        <Box
          key={shellTab.id}
          position="absolute"
          width="100%"
          zIndex={index === currentTab ? 1 : 0}
        >
          <Shell
            height={allowTabs === 'yes' ? 'calc(100vh - 42px)' : '100vh'}
            cmd={cmd}
            containerId={shellTab.containerId}
          />
        </Box>
      ))}
    </Box>
  );
}

type ShellProps = {
  containerId: string;
  cmd: string | null;
  height?: string;
};

function Shell({ containerId, cmd, height = '100vh' }: ShellProps) {
  const toast = useToast();
  const [stream, setStream] = useState<NodeJS.ReadWriteStream>();

  useEffect(() => {
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
    <Box height={height} width="100%" bg="black">
      {stream && <Terminal stdin={true} stream={stream} />}
    </Box>
  );
}

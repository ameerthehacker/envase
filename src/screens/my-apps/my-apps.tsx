import React, { useState, useRef, useCallback } from 'react';
import { Stack, Box, useToast, useDisclosure } from '@chakra-ui/core';
import AppStatusCard from '../../components/app-status-card/app-status-card';
import { useAppStatus, AppStatus } from '../../contexts/app-status/app-status';
import { useApp } from '../../hooks/use-app/use-app';
import { getContainerAppLogs } from '../../services/docker';
import LogsModal from '../../components/logs-modal/logs-modal';
import { ipcRenderer } from '../../services/native';
import { IPC_CHANNELS } from '../../constants';

const { ATTACH_SHELL } = IPC_CHANNELS;

export default function MyApps() {
  const { allAppStatus } = useAppStatus();
  const { start, stop, del } = useApp();
  const [selectedApp, setSelectedApp] = useState<AppStatus>();
  const [selectedAppLogs, setSelectedAppLogs] = useState('');
  const currentLogsStream = useRef<NodeJS.ReadableStream>();
  const actions = [
    {
      text: 'Show logs',
      value: 'SHOW_LOGS'
    },
    {
      text: 'Attach Shell',
      value: 'ATTACH_SHELL'
    }
  ];
  const {
    isOpen: isLogsOpen,
    onClose: onLogsClose,
    onOpen: onLogsOpen
  } = useDisclosure();
  const toast = useToast();

  const handleAction = useCallback(
    (status: AppStatus, action: string) => {
      switch (action) {
        case 'SHOW_LOGS': {
          setSelectedApp(status);
          getContainerAppLogs(status.id)
            .then((stream) => {
              currentLogsStream.current = stream;
              setSelectedAppLogs('');

              stream.on('data', (data) => {
                setSelectedAppLogs((logs) => `${logs}${data.toString('utf8')}`);
              });

              onLogsOpen();
            })
            .catch((err) => {
              toast({
                title: 'Unable to read logs',
                description: `${err}`,
                status: 'error',
                isClosable: true
              });
            });

          break;
        }
        case 'ATTACH_SHELL': {
          ipcRenderer.send(ATTACH_SHELL, {
            containerId: status.id
          });
          break;
        }
      }
    },
    [onLogsOpen, toast]
  );

  return (
    <Stack flexWrap="wrap" direction="row">
      {!allAppStatus.isFetching &&
        allAppStatus.status.map((status, index) => (
          <Box marginTop={4} key={index}>
            <AppStatusCard
              name={status.name}
              logo={status.formula.logo}
              state={status.state}
              inStateTransit={status.inTransit}
              isDeleting={status.isDeleting}
              onStartClick={() =>
                start(status.id).catch((err) => {
                  toast({
                    title: `Unable to start ${status.name}`,
                    description: `${err}`,
                    isClosable: true,
                    status: 'error'
                  });
                })
              }
              onStopClick={() =>
                stop(status.id).catch((err) => {
                  toast({
                    title: `Unable to stop ${status.name}`,
                    description: `${err}`,
                    isClosable: true,
                    status: 'error'
                  });
                })
              }
              onDeleteClick={() =>
                del(status.id).catch((err) => {
                  toast({
                    title: `Unable to delete ${status.name}`,
                    description: `${err}`,
                    isClosable: true,
                    status: 'error'
                  });
                })
              }
              actions={actions}
              onActionClick={(action) => handleAction(status, action)}
            />
          </Box>
        ))}
      <LogsModal
        onClose={() => {
          currentLogsStream.current?.removeAllListeners();
          onLogsClose();
        }}
        isOpen={isLogsOpen}
        logs={selectedAppLogs}
        appName={selectedApp?.name || 'no-app'}
      />
    </Stack>
  );
}

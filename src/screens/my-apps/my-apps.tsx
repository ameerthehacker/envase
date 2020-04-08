import React, { useState, useRef } from 'react';
import { Stack, Box, useToast, useDisclosure } from '@chakra-ui/core';
import AppStatusCard from '../../components/app-status-card/app-status-card';
import { useAppStatus, AppStatus } from '../../contexts/app-status/app-status';
import { useApp } from '../../hooks/use-app/use-app';
import { getContainerAppLogs } from '../../services/docker';
import LogsModal from '../../components/logs-modal/logs-modal';

export default function MyApps() {
  const { allAppStatus } = useAppStatus();
  const { start, stop, del } = useApp();
  const toast = useToast();
  const [selectedApp, setSelectedApp] = useState<AppStatus>();
  const [selectedAppLogs, setSelectedAppLogs] = useState('');
  const currentLogsStream = useRef<NodeJS.ReadableStream>();
  const actions = [
    {
      text: 'Show logs',
      value: 'SHOW_LOGS'
    }
  ];
  const {
    isOpen: isLogsOpen,
    onClose: onLogsClose,
    onOpen: onLogsOpen
  } = useDisclosure();

  return (
    <Stack direction="row">
      {!allAppStatus.isFetching &&
        allAppStatus.status.map((status, index) => (
          <Box key={index}>
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
              onActionClick={(action) => {
                if (action === 'SHOW_LOGS') {
                  setSelectedApp(status);
                  getContainerAppLogs(status.id).then((stream) => {
                    currentLogsStream.current = stream;
                    setSelectedAppLogs('');

                    stream.on('data', (data) => {
                      setSelectedAppLogs(
                        (logs) => `${logs}${data.toString('utf-8')}`
                      );
                    });

                    onLogsOpen();
                  });
                }
              }}
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

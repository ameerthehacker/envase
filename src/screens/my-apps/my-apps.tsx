import React, { useState, useRef, useCallback } from 'react';
import { Stack, Box, useToast, useDisclosure } from '@chakra-ui/core';
import AppStatusCard from '../../components/app-status-card/app-status-card';
import { useAppStatus, AppStatus } from '../../contexts/app-status/app-status';
import { useApp } from '../../hooks/use-app/use-app';
import { getContainerAppLogs } from '../../services/docker';
import LogsModal from '../../components/logs-modal/logs-modal';
import { ipcRenderer } from '../../services/native';
import { IPC_CHANNELS } from '../../constants';
import ConfirmDialogModal from '../../components/confirm-dialog-modal/confirm-dialog-modal';
import ExecModal from '../../components/exec-modal/exec-modal';
import { FaTerminal, FaScroll, FaRunning } from 'react-icons/fa';
import { Action } from '../../contracts/action';
import { open } from '../../services/native';
import { CustomAction } from '../../contracts/formula';

const { ATTACH_SHELL } = IPC_CHANNELS;

export default function MyApps() {
  const { allAppStatus } = useAppStatus();
  const { start, stop, del } = useApp();
  const [selectedApp, setSelectedApp] = useState<AppStatus>();
  const [selectedAppLogs, setSelectedAppLogs] = useState('');
  const currentLogsStream = useRef<NodeJS.ReadableStream>();
  const actions: Action[] = [
    {
      text: 'Show logs',
      value: 'SHOW_LOGS',
      icon: FaScroll
    },
    {
      text: 'Attach Shell',
      value: 'ATTACH_SHELL',
      shouldBeRunning: true,
      icon: FaTerminal
    },
    {
      text: 'Exec Command',
      value: 'EXEC',
      shouldBeRunning: true,
      icon: FaRunning
    }
  ];
  const {
    isOpen: isLogsOpen,
    onClose: onLogsClose,
    onOpen: onLogsOpen
  } = useDisclosure();
  const {
    isOpen: isConfirmDialogOpen,
    onClose: onConfirmDialogClose,
    onOpen: onConfirmDialogOpen
  } = useDisclosure();
  const {
    isOpen: isExecOpen,
    onClose: onExecClose,
    onOpen: onExecOpen
  } = useDisclosure();
  const toast = useToast();

  const handleCustomAction = useCallback(
    (status: AppStatus, action: CustomAction) => {
      const containerAppInfo = status?.containerAppInfo;

      if (containerAppInfo && containerAppInfo.formula?.actions) {
        const interpolatedAction = containerAppInfo.formula.actions.find(
          (elem) => elem.value === action.value
        );

        if (interpolatedAction && interpolatedAction.exec) {
          ipcRenderer.send(ATTACH_SHELL, {
            containerId: status.id,
            cmd: interpolatedAction.exec
          });
        }
        if (interpolatedAction && interpolatedAction.openInBrowser) {
          open(interpolatedAction.openInBrowser);
        }
      }
    },
    [selectedApp]
  );

  const handleAction = useCallback(
    (status: AppStatus, action: string) => {
      switch (action) {
        case 'SHOW_LOGS': {
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
        case 'EXEC': {
          setSelectedApp(status);
          onExecOpen();
        }
      }
    },
    [onLogsOpen, onExecOpen, toast]
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
              onDeleteClick={() => {
                setSelectedApp(status);
                onConfirmDialogOpen();
              }}
              actions={actions}
              customActions={status.formula.actions}
              onActionClick={(action) => {
                handleAction(status, action);
              }}
              onCustomActionClick={(action) => {
                handleCustomAction(status, action);
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
      <ExecModal
        isOpen={isExecOpen}
        onSubmit={(cmd) => {
          onExecClose();
          if (cmd && cmd.length > 0) {
            ipcRenderer.send(ATTACH_SHELL, {
              containerId: selectedApp?.id,
              cmd: cmd.trim()
            });
          }
        }}
      />
      <ConfirmDialogModal
        isOpen={isConfirmDialogOpen}
        title="Are you sure?"
        description={`The app ${selectedApp?.name} will be deleted forever!`}
        onSubmit={(ok) => {
          if (ok && selectedApp) {
            del(selectedApp.id).catch((err) => {
              toast({
                title: `Unable to delete ${selectedApp.name}`,
                description: `${err}`,
                isClosable: true,
                status: 'error'
              });
            });
          }

          onConfirmDialogClose();
        }}
      />
    </Stack>
  );
}

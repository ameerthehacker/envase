import React, { useState, useRef, useCallback } from 'react';
import {
  Stack,
  Box,
  useToast,
  useDisclosure,
  Text,
  HStack
} from '@chakra-ui/react';
import AppStatusCard from '../../components/app-status-card/app-status-card';
import { AppStatus, AllAppStatus } from '../../contexts/app-status/app-status';
import { useApp } from '../../hooks/use-app/use-app';
import {
  getContainerAppLogs,
  performCustomAction
} from '../../services/docker/docker';
import LogsModal from '../../components/logs-modal/logs-modal';
import { ipcRenderer } from '../../services/native/native';
import { GA_CATEGORIES, GA_ACTIONS, IPC_CHANNELS } from '../../constants';
import ConfirmDialogModal from '../../components/confirm-dialog-modal/confirm-dialog-modal';
import ExecModal from '../../components/exec-modal/exec-modal';
import { FaTerminal, FaScroll, FaRunning, FaInfo } from 'react-icons/fa';
import { Action } from '../../contracts/action';
import { CustomAction } from '../../contracts/formula';
import { Category } from '../../contracts/category';
import NoResults from '../../components/no-results/no-results';
import AppFormModal from '../../components/app-form-modal/app-form-modal';
import ReactGA from 'react-ga';

const { ATTACH_SHELL } = IPC_CHANNELS;

export interface MyAppsProps {
  allAppStatus: AllAppStatus;
  searchText?: string;
  selectedCategories?: Category;
}

export default function MyApps({
  allAppStatus,
  searchText,
  selectedCategories
}: MyAppsProps) {
  const { start, stop, del } = useApp();
  const [selectedApp, setSelectedApp] = useState<AppStatus>();
  const [selectedAppLogs, setSelectedAppLogs] = useState<
    NodeJS.ReadWriteStream
  >();
  const currentLogsStream = useRef<NodeJS.ReadableStream>();
  const actions: Action[] = [
    { text: 'Show Info', value: 'SHOW_INFO', icon: FaInfo },
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
      text: 'Run Command',
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
    isOpen: isAppFormDialogOpen,
    onClose: onAppFormDialogClose,
    onOpen: onAppFormDialogOpen
  } = useDisclosure();
  const {
    isOpen: isExecOpen,
    onClose: onExecClose,
    onOpen: onExecOpen
  } = useDisclosure();
  const toast = useToast();

  const handleCustomAction = useCallback(
    (status: AppStatus, action: CustomAction) => {
      const { actions } = status?.containerAppInfo?.getInterpolatedFormula();

      if (actions && !performCustomAction(status.id, actions, action.value)) {
        toast({
          title: 'oops!',
          description: 'Action not found, please raise an issue in GitHub',
          status: 'error',
          isClosable: true
        });
      }
    },
    [toast]
  );

  const handleAction = useCallback(
    (status: AppStatus, action: string) => {
      setSelectedApp(status);

      switch (action) {
        case 'SHOW_LOGS': {
          // track when user views app logs
          ReactGA.event({
            category: GA_CATEGORIES.APP_OPS,
            action: GA_ACTIONS.VIEW_APP_LOGS,
            label: status.formula.name
          });

          getContainerAppLogs(status.id)
            .then((stream) => {
              setSelectedAppLogs(stream);

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
          // track when user shells into an app
          ReactGA.event({
            category: GA_CATEGORIES.APP_OPS,
            action: GA_ACTIONS.SHELL_INTO_APP,
            label: status.formula.name
          });

          ipcRenderer.send(ATTACH_SHELL, {
            containerId: status.id
          });
          break;
        }
        case 'EXEC': {
          // track when user executes command in an app
          ReactGA.event({
            category: GA_CATEGORIES.APP_OPS,
            action: GA_ACTIONS.EXEC_APP,
            label: status.formula.name
          });

          onExecOpen();
          break;
        }
        case 'SHOW_INFO': {
          // track when user view info in an app
          ReactGA.event({
            category: GA_CATEGORIES.APP_OPS,
            action: GA_ACTIONS.VIEW_APP_INFO,
            label: status.formula.name
          });

          onAppFormDialogOpen();
        }
      }
    },
    [onLogsOpen, onExecOpen, toast, onAppFormDialogOpen]
  );

  const filteredApps = allAppStatus.status
    .filter((app) => {
      if (!searchText) return true;
      else return app.name.toLowerCase().includes(searchText.toLowerCase());
    })
    .filter((app) =>
      app.formula.tags?.find((tag) => {
        if (!selectedCategories) return true;
        else return selectedCategories[tag];
      })
    );

  return (
    <HStack flexWrap="wrap">
      {filteredApps.length === 0 && <NoResults height="calc(100vh - 90px)" />}
      {!allAppStatus.isFetching &&
        filteredApps.length > 0 &&
        filteredApps.map((status, index) => (
          <Box style={{ marginLeft: 0 }} padding={1} key={index}>
            <AppStatusCard
              name={status.name}
              logo={status.formula.logo}
              state={status.state}
              tags={[
                {
                  text: status.formula.name,
                  variant: 'solid',
                  colorScheme: 'purple'
                }
              ]}
              inStateTransit={status.inTransit}
              isDeleting={status.isDeleting}
              onStartClick={() => {
                // track when user starts an app
                ReactGA.event({
                  category: GA_CATEGORIES.APP_LIFECYCLE,
                  action: GA_ACTIONS.START_APP,
                  label: status.formula.name
                });

                start(status.id).catch((err) => {
                  toast({
                    title: `Unable to start ${status.name}`,
                    description: `${err}`,
                    isClosable: true,
                    status: 'error'
                  });
                });
              }}
              onStopClick={() => {
                // track when user stops an app
                ReactGA.event({
                  category: GA_CATEGORIES.APP_LIFECYCLE,
                  action: GA_ACTIONS.STOP_APP,
                  label: status.formula.name
                });

                stop(status.id).catch((err) => {
                  toast({
                    title: `Unable to stop ${status.name}`,
                    description: `${err}`,
                    isClosable: true,
                    status: 'error'
                  });
                });
              }}
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
                ReactGA.event({
                  category: GA_CATEGORIES.APP_OPS,
                  action: GA_ACTIONS.CUSTOM_ACTION,
                  label: action.text
                });

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
        stream={selectedAppLogs}
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
        description={
          <Text>{`The app ${selectedApp?.name} will be deleted forever!`}</Text>
        }
        onSubmit={(ok) => {
          if (ok && selectedApp) {
            // track when user deletes an app
            ReactGA.event({
              category: GA_CATEGORIES.APP_LIFECYCLE,
              action: GA_ACTIONS.DELETE_APP,
              label: selectedApp.formula.name
            });

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
      <AppFormModal
        isReadOnly={true}
        app={selectedApp?.formula}
        values={selectedApp?.containerAppInfo.formValues}
        isOpen={isAppFormDialogOpen}
        onClose={onAppFormDialogClose}
      />
    </HStack>
  );
}

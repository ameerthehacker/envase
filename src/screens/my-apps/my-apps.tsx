import React from 'react';
import { Stack, Box, useToast } from '@chakra-ui/core';
import AppStatusCard from '../../components/app-status-card/app-status-card';
import { useAppStatus } from '../../contexts/app-status/app-status';
import { useApp } from '../../hooks/use-app/use-app';

export default function MyApps() {
  const { allAppStatus } = useAppStatus();
  const { start, stop, del } = useApp();
  const toast = useToast();

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
              onInfoClick={() => null}
            />
          </Box>
        ))}
    </Stack>
  );
}

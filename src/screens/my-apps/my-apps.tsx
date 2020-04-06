import React from 'react';
import { Stack, Box } from '@chakra-ui/core';
import AppStatusCard from '../../components/app-status-card/app-status-card';
import { useAppStatus } from '../../contexts/app-status/app-status';

export default function MyApps() {
  const { allAppStatus, dispatch } = useAppStatus();

  return (
    <Stack direction="row">
      {allAppStatus.status.map((status, index) => (
        <Box key={index}>
          <AppStatusCard
            name={status.name}
            logo={status.formula.logo}
            status={status.state}
            onStartClick={() =>
              dispatch({
                type: 'START',
                payload: { name: status.name }
              })
            }
            onStopClick={() =>
              dispatch({
                type: 'STOP',
                payload: { name: status.name }
              })
            }
            onInfoClick={() => null}
          />
        </Box>
      ))}
    </Stack>
  );
}

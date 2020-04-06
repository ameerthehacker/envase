import { useAppStatus } from '../../contexts/app-status/app-status';
import { useCallback } from 'react';
import { listContainerApps } from '../../services/docker';

export function useLoadApps() {
  const { dispatch } = useAppStatus();

  const loadApps = useCallback(
    async (isInitializing: boolean) => {
      if (isInitializing) {
        dispatch({ type: 'SET_FETCHING', payload: { isFetching: true } });
      }

      listContainerApps()
        .then((appStatus) => {
          dispatch({
            type: 'SET_STATUS',
            payload: {
              status: appStatus
            }
          });
        })
        .catch((err) =>
          dispatch({
            type: 'SET_ERROR',
            payload: {
              error: err
            }
          })
        )
        .finally(() => {
          dispatch({ type: 'SET_FETCHING', payload: { isFetching: false } });
        });
    },
    [dispatch]
  );

  return loadApps;
}

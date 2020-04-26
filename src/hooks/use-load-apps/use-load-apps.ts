import { useAppStatus } from '../../contexts/app-status/app-status';
import { useCallback } from 'react';
import { listContainerApps } from '../../services/docker';

export function useLoadApps() {
  const { dispatch } = useAppStatus();

  const loadApps = useCallback(
    async (isInitializing = false) => {
      if (isInitializing) {
        dispatch({ type: 'SET_FETCHING', payload: { isFetching: true } });
      }

      return new Promise((resolve, reject) => {
        listContainerApps()
          .then((appStatus) => {
            resolve(appStatus);

            dispatch({
              type: 'SET_STATUS',
              payload: {
                status: appStatus
              }
            });
          })
          .catch((err) => {
            reject(err);

            dispatch({
              type: 'SET_ERROR',
              payload: {
                error: err
              }
            });
          })
          .finally(() =>
            dispatch({
              type: 'SET_FETCHING',
              payload: {
                isFetching: false
              }
            })
          );
      });
    },
    [dispatch]
  );

  return loadApps;
}

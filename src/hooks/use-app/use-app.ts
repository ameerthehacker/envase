import { useAppStatus } from '../../contexts/app-status/app-status';
import { useCallback } from 'react';
import {
  startApp,
  stopApp,
  deleteApp,
  listContainerApps,
  onContainerHealthy,
  getContainerAppInfo,
  performOnHealthyAction
} from '../../services/docker/docker';
import { useToast } from '@chakra-ui/react';
import { ContainerInspectInfo } from 'dockerode';

export function useApp() {
  const { dispatch } = useAppStatus();
  const toast = useToast();

  const load = useCallback(
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

  const start = useCallback(
    (id: string) => {
      return new Promise((resolve, reject) => {
        dispatch({
          type: 'SET_IN_TRANSIT',
          payload: {
            id,
            inTransit: true
          }
        });

        startApp(id)
          .then(() => {
            dispatch({
              type: 'START',
              payload: {
                id
              }
            });

            onContainerHealthy(id)
              .then(() => {
                return getContainerAppInfo(id);
              })
              .then((containerAppInfo) => {
                performOnHealthyAction(
                  id,
                  containerAppInfo.getInterpolatedFormula()
                );
              })
              .catch((containerInfo: ContainerInspectInfo) => {
                toast({
                  title: 'Warning',
                  description: `Healthcheck failed for ${containerInfo.Name.substring(
                    1
                  )}, check the logs to know more`,
                  status: 'warning'
                });

                if (!containerInfo.State.Running) {
                  dispatch({
                    type: 'STOP',
                    payload: {
                      id
                    }
                  });
                }
              });

            resolve();
          })
          .catch((err) => reject(err));
      }).finally(() =>
        dispatch({
          type: 'SET_IN_TRANSIT',
          payload: {
            id,
            inTransit: false
          }
        })
      );
    },
    [dispatch, toast]
  );

  const stop = useCallback(
    (id: string) => {
      return new Promise((resolve, reject) => {
        dispatch({
          type: 'SET_IN_TRANSIT',
          payload: {
            id,
            inTransit: true
          }
        });

        stopApp(id)
          .then(() => {
            dispatch({
              type: 'STOP',
              payload: {
                id
              }
            });

            resolve();
          })
          .catch((err) => reject(err));
      }).finally(() =>
        dispatch({
          type: 'SET_IN_TRANSIT',
          payload: {
            id,
            inTransit: false
          }
        })
      );
    },
    [dispatch]
  );

  const del = useCallback(
    (id: string) => {
      return new Promise((resolve, reject) => {
        dispatch({
          type: 'SET_IS_DELETING',
          payload: {
            id,
            isDeleting: true
          }
        });

        deleteApp(id)
          .then(() => {
            dispatch({
              type: 'DELETE',
              payload: {
                id
              }
            });

            resolve();
          })
          .catch((err) => reject(err));
      }).finally(() =>
        dispatch({
          type: 'SET_IS_DELETING',
          payload: {
            id,
            isDeleting: false
          }
        })
      );
    },
    [dispatch]
  );

  return { load, start, stop, del };
}

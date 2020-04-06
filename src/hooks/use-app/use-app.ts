import { useAppStatus } from '../../contexts/app-status/app-status';
import { useCallback } from 'react';
import { startApp, stopApp, deleteApp } from '../../services/docker';

export function useApp() {
  const { dispatch } = useAppStatus();

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

  return { start, stop, del };
}

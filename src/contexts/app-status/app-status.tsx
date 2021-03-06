import React, { useContext, useReducer, Dispatch } from 'react';
import { createContext, ReactNode } from 'react';
import { Formula } from '../../contracts/formula';
import { ContainerAppInfo } from '../../contracts/container-app-info';

export interface DockerError {
  errno: 'ECONNREFUSED';
  code: 'ECONNREFUSED';
}

export interface AllAppStatus {
  error?: DockerError;
  isFetching: boolean;
  status: AppStatus[];
}

export interface AppStatus {
  id: string;
  name: string;
  formula: Formula;
  containerAppInfo: ContainerAppInfo;
  state: 'running' | 'stopped';
  inTransit: boolean;
  isDeleting: boolean;
}

const AppStatusStateContext = createContext<AllAppStatus | null>(null);
const AppStatusDispatchContext = createContext<Dispatch<Action> | null>(null);

const reducer = (state: AllAppStatus, action: Action): AllAppStatus => {
  switch (action.type) {
    case 'START': {
      const appIndex = state.status.findIndex(
        (el) => el.id === action.payload.id
      );

      if (~appIndex) {
        state.status[appIndex] = {
          ...state.status[appIndex],
          state: 'running'
        };
      }

      state.status = [...state.status];

      return { ...state };
    }
    case 'STOP': {
      const appIndex = state.status.findIndex(
        (el) => el.id === action.payload.id
      );

      if (~appIndex) {
        state.status[appIndex] = {
          ...state.status[appIndex],
          state: 'stopped'
        };
      }

      state.status = [...state.status];

      return { ...state };
    }
    case 'DELETE': {
      const appIndex = state.status.findIndex(
        (el) => el.id === action.payload.id
      );

      if (~appIndex) {
        state.status.splice(appIndex, 1);
      }

      state.status = [...state.status];

      return { ...state };
    }
    case 'SET_IN_TRANSIT': {
      const appIndex = state.status.findIndex(
        (el) => el.id === action.payload.id
      );

      if (~appIndex) {
        state.status[appIndex] = {
          ...state.status[appIndex],
          inTransit: action.payload.inTransit
        };
      }

      state.status = [...state.status];

      return { ...state };
    }
    case 'SET_IS_DELETING': {
      const appIndex = state.status.findIndex(
        (el) => el.id === action.payload.id
      );

      if (~appIndex) {
        state.status[appIndex] = {
          ...state.status[appIndex],
          isDeleting: action.payload.isDeleting
        };
      }

      state.status = [...state.status];

      return { ...state };
    }
    case 'SET_STATUS': {
      return { ...state, error: undefined, status: [...action.payload.status] };
    }
    case 'SET_FETCHING': {
      return { ...state, isFetching: action.payload.isFetching };
    }
    case 'SET_ERROR': {
      return {
        ...state,
        error: action.payload.error
      };
    }

    default:
      throw new Error(`unknown action`);
  }
};

const AppStatusProvider = ({ children }: { children: ReactNode }) => {
  const [allAppStatus, dispatch] = useReducer(reducer, {
    isFetching: false,
    status: []
  });

  return (
    <AppStatusStateContext.Provider value={allAppStatus}>
      <AppStatusDispatchContext.Provider value={dispatch}>
        {children}
      </AppStatusDispatchContext.Provider>
    </AppStatusStateContext.Provider>
  );
};

const useAppStatus = () => {
  const appStatusStateContext = useContext(AppStatusStateContext);
  const appStatusDispatchContext = useContext(AppStatusDispatchContext);

  if (!appStatusStateContext || !appStatusDispatchContext) {
    throw new Error('component must be wrapped with AppStatusProvider');
  }

  return {
    allAppStatus: appStatusStateContext,
    dispatch: appStatusDispatchContext
  };
};

type Action =
  | {
      type: 'START' | 'STOP' | 'DELETE' | 'UPDATE';
      payload: { id: string };
    }
  | {
      type: 'SET_IN_TRANSIT';
      payload: { id: string; inTransit: boolean };
    }
  | {
      type: 'SET_IS_DELETING';
      payload: { id: string; isDeleting: boolean };
    }
  | {
      type: 'SET_STATUS';
      payload: {
        status: AppStatus[];
      };
    }
  | {
      type: 'SET_FETCHING';
      payload: {
        isFetching: boolean;
      };
    }
  | {
      type: 'SET_ERROR';
      payload: {
        error?: DockerError;
      };
    };

export { AppStatusProvider, useAppStatus, reducer };

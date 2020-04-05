import React, { useContext, useReducer, Dispatch } from 'react';
import { createContext, ReactNode } from 'react';
import { Formula } from '../../contracts/formula';

export interface AppStatus {
  name: string;
  formula: Formula;
  state: 'running' | 'stopped';
}

const AppStatusStateContext = createContext<AppStatus[] | null>(null);
const AppStatusDispatchContext = createContext<Dispatch<Action> | null>(null);

const reducer = (state: AppStatus[], action: Action) => {
  switch (action.type) {
    case 'START': {
      const appIndex = state.findIndex((el) => el.name === action.payload.name);

      if (~appIndex) {
        state[appIndex] = {
          ...state[appIndex],
          state: 'running'
        };
      }

      return [...state];
    }
    case 'STOP': {
      const appIndex = state.findIndex((el) => el.name === action.payload.name);

      if (~appIndex) {
        state[appIndex] = {
          ...state[appIndex],
          state: 'stopped'
        };
      }

      return [...state];
    }
    case 'INIT': {
      return [...action.payload.status];
    }

    default:
      throw new Error(`unknown action`);
  }
};

const AppStatusProvider = ({ children }: { children: ReactNode }) => {
  const [status, dispatch] = useReducer(reducer, []);

  return (
    <AppStatusStateContext.Provider value={status}>
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
    status: appStatusStateContext,
    dispatch: appStatusDispatchContext
  };
};

type Action =
  | {
      type: 'START' | 'STOP';
      payload: { name: string };
    }
  | {
      type: 'INIT';
      payload: {
        status: AppStatus[];
      };
    };

export { AppStatusProvider, useAppStatus, reducer };

import React, { useContext, useReducer } from 'react';
import { createContext, ReactNode } from 'react';

export interface AppStatus {
  name: string;
  formulaName: string;
  state: 'running' | 'stopped' | 'intransit';
}

const AppStatusStateContext = createContext<AppStatus[] | null>(null);
const AppStatusDispatchContext = createContext<AppStatus[] | null>(null);

const AppStatusProvider = (status: AppStatus[], children: ReactNode) => (
  <AppStatusStateContext.Provider value={status}>
    <AppStatusDispatchContext.Provider value={status}>
      {children}
    </AppStatusDispatchContext.Provider>
  </AppStatusStateContext.Provider>
);

type Action = {
  type: 'START' | 'STOP';
  payload: { name: string };
};

const reducer = (state: AppStatus[], action: Action) => {
  switch (action.type) {
    case 'START': {
      const appIndex = state.findIndex((el) => el.name === action.payload.name);

      if (~status) {
        state[appIndex] = {
          ...state[appIndex],
          state: 'running'
        };
      }

      return [...state];
    }
    case 'STOP': {
      const appIndex = state.findIndex((el) => el.name === action.payload.name);

      if (~status) {
        state[appIndex] = {
          ...state[appIndex],
          state: 'stopped'
        };
      }

      return [...state];
    }

    default:
      throw new Error(`action ${action.type} is not handled`);
  }
};

const useAppStatus = () => {
  const appStatusStateContext = useContext(AppStatusStateContext);
  const appStatusDispatchContext = useContext(AppStatusDispatchContext);

  const [appStatus, dispatch] = useReducer(
    reducer,
    appStatusStateContext || []
  );

  if (!appStatusDispatchContext || !appStatusStateContext) {
    throw new Error('the component is not wrapped in AppStatusProvider');
  }

  return [appStatus, dispatch];
};

export { AppStatusProvider, useAppStatus, reducer };

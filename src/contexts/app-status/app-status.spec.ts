import { reducer, AppStatus } from './app-status';
import MY_FORMULA from './formula.fixture';

describe('AppStatus reducer', () => {
  it('should update the state with start action', () => {
    const status: AppStatus[] = [
      {
        id: 'mysql',
        inTransit: false,
        name: 'mysql',
        state: 'running',
        formula: MY_FORMULA
      },
      {
        id: 'vscode',
        inTransit: false,
        name: 'vscode',
        state: 'stopped',
        formula: MY_FORMULA
      }
    ];

    expect(
      reducer(
        { isFetching: false, status },
        { type: 'START', payload: { id: 'vscode' } }
      )
    ).toEqual({
      isFetching: false,
      status: [
        {
          id: 'mysql',
          inTransit: false,
          name: 'mysql',
          state: 'running',
          formula: MY_FORMULA
        },
        {
          id: 'vscode',
          inTransit: false,
          name: 'vscode',
          state: 'running',
          formula: MY_FORMULA
        }
      ]
    });
  });

  it('should update the state with stop action', () => {
    const status: AppStatus[] = [
      {
        id: 'mysql',
        inTransit: false,
        name: 'mysql',
        state: 'running',
        formula: MY_FORMULA
      },
      {
        id: 'vscode',
        inTransit: false,
        name: 'vscode',
        state: 'stopped',
        formula: MY_FORMULA
      }
    ];

    expect(
      reducer(
        { isFetching: false, status },
        { type: 'STOP', payload: { id: 'mysql' } }
      )
    ).toEqual({
      isFetching: false,
      status: [
        {
          id: 'mysql',
          inTransit: false,
          name: 'mysql',
          state: 'stopped',
          formula: MY_FORMULA
        },
        {
          id: 'vscode',
          inTransit: false,
          name: 'vscode',
          state: 'stopped',
          formula: MY_FORMULA
        }
      ]
    });
  });
});

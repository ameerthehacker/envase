import { reducer, AppStatus } from './app-status';

describe('AppStatus reducer', () => {
  it('should update the state with start action', () => {
    const state: AppStatus[] = [
      {
        name: 'mysql',
        state: 'running'
      },
      {
        name: 'vscode',
        state: 'stopped'
      }
    ];

    expect(
      reducer(state, { type: 'START', payload: { name: 'vscode' } })
    ).toEqual([
      {
        name: 'mysql',
        state: 'running'
      },
      {
        name: 'vscode',
        state: 'running'
      }
    ]);
  });

  it('should update the state with stop action', () => {
    const state: AppStatus[] = [
      {
        name: 'mysql',
        state: 'running'
      },
      {
        name: 'vscode',
        state: 'stopped'
      }
    ];

    expect(
      reducer(state, { type: 'STOP', payload: { name: 'mysql' } })
    ).toEqual([
      {
        name: 'mysql',
        state: 'stopped'
      },
      {
        name: 'vscode',
        state: 'stopped'
      }
    ]);
  });
});

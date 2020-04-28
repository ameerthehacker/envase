import { reducer, AppStatus } from './app-status';
import { FORMULA } from '../../../tests/fixtures/app.fixture';

describe('AppStatus reducer', () => {
  it('should update the state with start action', () => {
    const status: AppStatus[] = [
      {
        id: 'mysql',
        inTransit: false,
        name: 'mysql',
        state: 'running',
        formula: FORMULA,
        isDeleting: false
      },
      {
        id: 'vscode',
        inTransit: false,
        name: 'vscode',
        state: 'stopped',
        formula: FORMULA,
        isDeleting: false
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
          formula: FORMULA,
          isDeleting: false
        },
        {
          id: 'vscode',
          inTransit: false,
          name: 'vscode',
          state: 'running',
          formula: FORMULA,
          isDeleting: false
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
        formula: FORMULA,
        isDeleting: false
      },
      {
        id: 'vscode',
        inTransit: false,
        name: 'vscode',
        state: 'stopped',
        formula: FORMULA,
        isDeleting: false
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
          formula: FORMULA,
          isDeleting: false
        },
        {
          id: 'vscode',
          inTransit: false,
          name: 'vscode',
          state: 'stopped',
          formula: FORMULA,
          isDeleting: false
        }
      ]
    });
  });
});

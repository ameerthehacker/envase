import React from 'react';
import { render, fireEvent } from '../../../tests/test-util';
import AppStatusCard from './app-status-card';

describe('AppStatusCard', () => {
  it('should show play button when stopped', () => {
    const { getByLabelText } = render(
      <AppStatusCard
        onStartClick={() => null}
        onStopClick={() => null}
        onInfoClick={() => null}
        name="mysql"
        logo="mysql-logo"
        status="stopped"
      />
    );
    const btnStart = getByLabelText('start-app');

    expect(btnStart).toBeTruthy();
  });

  it('should call onStartClick callback when start is clicked', () => {
    const onStartClick = jest.fn();
    const { getByLabelText } = render(
      <AppStatusCard
        onStartClick={onStartClick}
        onStopClick={() => null}
        onInfoClick={() => null}
        name="mysql"
        logo="mysql-logo"
        status="stopped"
      />
    );
    const btnStart = getByLabelText('start-app');

    fireEvent.click(btnStart);

    expect(onStartClick).toHaveBeenCalledTimes(1);
  });

  it('should call onStopClick callback when stop is clicked', () => {
    const onStopClick = jest.fn();
    const { getByLabelText } = render(
      <AppStatusCard
        onStartClick={() => null}
        onStopClick={onStopClick}
        onInfoClick={() => null}
        name="mysql"
        logo="mysql-logo"
        status="running"
      />
    );
    const btnStop = getByLabelText('stop-app');

    fireEvent.click(btnStop);

    expect(onStopClick).toHaveBeenCalledTimes(1);
  });

  it('should show play button when stopped', () => {
    const { getByLabelText } = render(
      <AppStatusCard
        onStartClick={() => null}
        onStopClick={() => null}
        onInfoClick={() => null}
        name="mysql"
        logo="mysql-logo"
        status="running"
      />
    );
    const btnStop = getByLabelText('stop-app');

    expect(btnStop).toBeTruthy();
  });

  it('should call onInfoClick callback when info is clicked', () => {
    const onInfoClick = jest.fn();
    const { getByLabelText } = render(
      <AppStatusCard
        onStartClick={() => null}
        onStopClick={() => null}
        onInfoClick={onInfoClick}
        name="mysql"
        logo="mysql-logo"
        status="running"
      />
    );
    const btnInfo = getByLabelText('info');

    fireEvent.click(btnInfo);

    expect(onInfoClick).toHaveBeenCalledTimes(1);
  });
});

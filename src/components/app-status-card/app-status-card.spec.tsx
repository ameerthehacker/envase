import React from 'react';
import { render, fireEvent } from '../../../tests/test-util';
import AppStatusCard, { AppStatucCardProps } from './app-status-card';

describe('AppStatusCard', () => {
  const defaultProps: AppStatucCardProps = {
    onStartClick: () => null,
    onStopClick: () => null,
    onDeleteClick: () => null,
    name: 'mysql',
    logo: 'mysql-logo',
    state: 'stopped',
    isDeleting: false,
    actions: [],
    onActionClick: () => null
  };

  it('should show play button when stopped', () => {
    const { getByLabelText } = render(
      <AppStatusCard {...defaultProps} state="stopped" />
    );
    const btnStart = getByLabelText('start-app');

    expect(btnStart).toBeTruthy();
  });

  it('should call onStartClick callback when start is clicked', () => {
    const onStartClick = jest.fn();
    const { getByLabelText } = render(
      <AppStatusCard {...defaultProps} onStartClick={onStartClick} />
    );
    const btnStart = getByLabelText('start-app');

    fireEvent.click(btnStart);

    expect(onStartClick).toHaveBeenCalledTimes(1);
  });

  it('should call onStopClick callback when stop is clicked', () => {
    const onStopClick = jest.fn();
    const { getByLabelText } = render(
      <AppStatusCard
        {...defaultProps}
        state="running"
        onStopClick={onStopClick}
      />
    );
    const btnStop = getByLabelText('stop-app');

    fireEvent.click(btnStop);

    expect(onStopClick).toHaveBeenCalledTimes(1);
  });

  it('should show stop button when running', () => {
    const { getByLabelText } = render(
      <AppStatusCard {...defaultProps} state="running" />
    );
    const btnStop = getByLabelText('stop-app');

    expect(btnStop).toBeTruthy();
  });

  it('should be disabled in state transition while running', () => {
    const { getByLabelText } = render(
      <AppStatusCard {...defaultProps} state="running" inStateTransit={true} />
    );

    const btnStop = getByLabelText('stop-app');

    expect(btnStop).toBeDisabled();
  });

  it('start should be disabled in state transition while stopped', () => {
    const { getByLabelText } = render(
      <AppStatusCard {...defaultProps} state="stopped" inStateTransit={true} />
    );

    const btnStart = getByLabelText('start-app');

    expect(btnStart).toBeDisabled();
  });

  it('delete should be disabled when state is running', () => {
    const { getByLabelText } = render(
      <AppStatusCard {...defaultProps} state="running" />
    );

    const btnDelete = getByLabelText('delete-app');

    expect(btnDelete).toBeDisabled();
  });

  it('clicking on delete should call onDelete', () => {
    const onDeleteClick = jest.fn();

    const { getByLabelText } = render(
      <AppStatusCard
        {...defaultProps}
        state={'stopped'}
        onDeleteClick={onDeleteClick}
      />
    );
    const btnDelete = getByLabelText('delete-app');

    fireEvent.click(btnDelete);

    expect(onDeleteClick).toHaveBeenCalledTimes(1);
  });

  it('clicking on action should trigger onAction', () => {
    const onActionClick = jest.fn();

    const { getByLabelText, getByText } = render(
      <AppStatusCard
        {...defaultProps}
        actions={[
          {
            text: 'show logs',
            value: 'LOGS'
          }
        ]}
        onActionClick={onActionClick}
      />
    );
    const btnAction = getByLabelText('action-button');

    fireEvent.click(btnAction);

    const btnShowLogs = getByText('show logs');

    fireEvent.click(btnShowLogs);

    expect(btnShowLogs).toBeTruthy();
    expect(onActionClick).toHaveBeenCalledWith('LOGS');
  });
});

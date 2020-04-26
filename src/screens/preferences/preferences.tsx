import React from 'react';
import SettingsModal, {
  SettingsModalProps
} from '../../components/settings-modal/settings-modal';
import { ipcRenderer, allSettings } from '../../services/native';
import { IPC_CHANNELS } from '../../constants';

const { SAVE_SETTINGS } = IPC_CHANNELS;

export type PreferencesProps = Omit<
  Omit<SettingsModalProps, 'onSubmit'>,
  'allSettings'
>;

export default function Preferences({ isOpen, onClose }: PreferencesProps) {
  return (
    <SettingsModal
      allSettings={allSettings}
      onSubmit={(newSettings) => {
        ipcRenderer.send(SAVE_SETTINGS, newSettings);
        ipcRenderer.on(SAVE_SETTINGS, onClose);
      }}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
}

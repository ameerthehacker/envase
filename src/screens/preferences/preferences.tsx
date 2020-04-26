import React from 'react';
import SettingsModal, {
  SettingsModalProps
} from '../../components/settings-modal/settings-modal';
import { ipcRenderer } from '../../services/native';
import { IPC_CHANNELS } from '../../constants';

const { SAVE_SETTINGS } = IPC_CHANNELS;

export type PreferencesProps = Omit<SettingsModalProps, 'onSubmit'>;

export default function Preferences({ isOpen, onClose }: PreferencesProps) {
  return (
    <SettingsModal
      onSubmit={(newSettings) => {
        ipcRenderer.send(SAVE_SETTINGS, newSettings);
        ipcRenderer.on(SAVE_SETTINGS, onClose);
      }}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
}

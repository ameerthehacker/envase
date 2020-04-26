import React from 'react';
import SettingsModal, {
  SettingsModalProps
} from '../../components/settings-modal/settings-modal';

export type PreferencesProps = Omit<SettingsModalProps, 'onSubmit'>;

export default function Preferences({ isOpen, onClose }: PreferencesProps) {
  return (
    <SettingsModal
      onSubmit={(values) => console.log(values)}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
}

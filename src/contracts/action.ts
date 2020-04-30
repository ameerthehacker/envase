import { IconType } from 'react-icons/lib/cjs';

export interface Action {
  text: string;
  value: string;
  icon?: IconType;
  shouldBeRunning?: boolean;
}

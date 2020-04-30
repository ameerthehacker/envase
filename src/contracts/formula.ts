import { Action } from './action';

export interface CustomAction extends Action {
  openInBrowser?: string;
  exec?: string;
}
export interface Formula {
  name: string;
  data: {
    [key: string]: FormulaField;
  };
  env: Record<string, string>;
  image: string;
  logo: string;
  defaultShell: string;
  ports?: Record<string, string>;
  volumes?: Record<string, string>;
  isCli?: boolean;
  actions?: CustomAction[];
}

interface FormulaField {
  type: 'string' | 'number' | 'password' | 'path' | 'option';
  options?: string[];
  required?: boolean;
  description: string;
  default?: string | number;
}

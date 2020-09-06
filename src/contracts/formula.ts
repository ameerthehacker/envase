import { Action } from './action';

export type Tag = 'Database' | 'OS' | 'Language' | 'Platform' | 'Application';

export interface CustomAction extends Action {
  openInBrowser?: string;
  exec?: string;
}

export interface HealthCheck {
  test: string[];
  interval: number;
  timeout: number;
  retries: number;
  startPeriod: number;
}

export interface Formula {
  name: string;
  data: {
    name: FormulaField;
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
  tags?: Tag[];
  cmd?: string[];
  onHealthyActions?: string[];
  dependencies?: Formula[];
  healthCheck?: HealthCheck;
}

interface FormulaField {
  type: 'string' | 'number' | 'password' | 'path' | 'option';
  options?: string[];
  required?: boolean;
  description: string;
  default?: string | number;
}

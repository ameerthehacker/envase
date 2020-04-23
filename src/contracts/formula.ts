export interface Formula {
  name: string;
  data: {
    [key: string]: FormulaField;
  };
  env: Record<string, string>;
  image: string;
  logo: string;
  shell: string;
  ports?: Record<string, string>;
  volumes?: Record<string, string>;
  isCli?: boolean;
}

interface FormulaField {
  type: 'string' | 'number' | 'password' | 'path';
  required?: boolean;
  description: string;
  default?: string | number;
}

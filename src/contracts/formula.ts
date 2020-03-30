export interface Formula {
  name: string;
  data: {
    [key: string]: FormulaField;
  };
  env: {
    [key: string]: string;
  };
  image: string;
  logo: string;
}

interface FormulaField {
  type: 'string' | 'number' | 'password' | 'path';
  required?: boolean;
  description: string;
  default?: string | number;
}

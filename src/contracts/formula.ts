export interface Formula {
  data: {
    [key: string]: FormulaField;
  };
  env: {
    [key: string]: string;
  };
  image: string;
}

interface FormulaField {
  type: 'string' | 'number' | 'password';
  required?: boolean;
  description: string;
  default?: string | number;
}

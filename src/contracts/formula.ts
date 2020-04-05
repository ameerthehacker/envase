export interface Formula {
  name: string;
  data: {
    [key: string]: FormulaField;
  };
  env: Record<string, string>;
  image: string;
  logo: string;
  ports?: Record<string, string>;
}

interface FormulaField {
  type: 'string' | 'number' | 'password' | 'path';
  required?: boolean;
  description: string;
  default?: string | number;
}

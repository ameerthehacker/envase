import { Formula } from './formula';

export interface ContainerAppInfo {
  formValues: Record<string, any>;
  getInterpolatedFormula: () => Formula;
  version?: string;
  image?: string;
}

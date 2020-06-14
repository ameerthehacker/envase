import { Formula } from './formula';
import { AppFormResult } from '../components/app-form-modal/app-form-modal';

export interface ContainerAppInfo {
  formValues: AppFormResult;
  getInterpolatedFormula: () => Formula;
  version?: string;
  image?: string;
}

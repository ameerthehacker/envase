import { Formula } from '../../contracts/formula';
import logo from './logo.svg';

const VSCODE: Formula = {
  name: 'VS Code',
  logo,
  data: {
    name: {
      type: 'string',
      description: 'Name of the VS Code instance',
      required: true
    },
    port: {
      type: 'number',
      description: 'Port on which VS Code server should run',
      default: 3306,
      required: true
    },
    project: {
      type: 'string',
      description: 'Projects folder',
      required: true
    }
  },
  image: 'vscode',
  env: {}
};

export default VSCODE;

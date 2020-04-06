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
    password: {
      type: 'password',
      description: 'Password to login to your vscode',
      required: true
    },
    port: {
      type: 'number',
      description: 'Port on which VS Code server should run',
      default: 8080,
      required: true
    },
    project: {
      type: 'path',
      description: 'Projects folder',
      required: true
    }
  },
  image: 'codercom/code-server',
  env: {
    PASSWORD: '%password%'
  },
  ports: {
    8080: '%port%'
  },
  volumes: {
    '/home/coder/project': '%project%'
  }
};

export default VSCODE;

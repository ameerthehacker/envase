import { Formula } from '../../contracts/formula';
import logo from './logo.svg';
import { FaCode } from 'react-icons/fa';

const VSCODE: Formula = {
  name: 'VS Code',
  defaultShell: '/bin/bash',
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
  },
  actions: [
    {
      text: 'Open VSCode',
      value: 'OPEN_VSCODE',
      icon: FaCode,
      openInBrowser: 'http://localhost:%port%',
      shouldBeRunning: true
    }
  ],
  tags: ['Application']
};

export default VSCODE;

/* eslint-disable @typescript-eslint/camelcase */
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
    port: {
      type: 'number',
      description: 'Port on which VS Code server should run',
      default: 8080,
      required: true
    },
    projects_folder: {
      type: 'path',
      description: 'Folder location where you have all your projects',
      required: true
    }
  },
  image: 'codercom/code-server',
  cmd: ['--auth', 'none'],
  ports: {
    8080: '%port%'
  },
  env: {},
  volumes: {
    '/home/coder/project': '%projects_folder%'
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
  healthCheck: {
    test: ['CMD', 'curl', 'http://localhost:8080'],
    retries: 5,
    startPeriod: 0,
    timeout: 5000,
    interval: 1000
  },
  onHealthyActions: ['OPEN_VSCODE'],
  tags: ['Application']
};

export default VSCODE;

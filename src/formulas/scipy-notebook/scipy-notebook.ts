/* eslint-disable @typescript-eslint/camelcase */
import { Formula } from '../../contracts/formula';
import logo from './logo.png';
import { FaCode } from 'react-icons/fa';

const SCIPY_NOTEBOOK: Formula = {
  name: 'SciPy Notebook',
  defaultShell: '/bin/bash',
  description: 'SciPy jupyter notebook for experimenting with data',
  website: 'https://www.scipy.org/',
  logo,
  data: {
    name: {
      type: 'string',
      description: 'Name of the SciPy notebook instance',
      required: true
    },
    port: {
      type: 'number',
      description: 'Port on which the notebook should run',
      default: 8888,
      required: true
    },
    projects_folder: {
      type: 'path',
      description: 'Folder location where you want to store the notebooks',
      required: true
    }
  },
  image: 'jupyter/scipy-notebook',
  ports: {
    8888: '%port%'
  },
  volumes: {
    '/home/jovyan/work': '%projects_folder%'
  },
  env: {},
  actions: [
    {
      text: 'Open Notebook',
      value: 'OPEN_SCIPY_NOTEBOOK',
      icon: FaCode,
      openInBrowser: 'http://localhost:8888',
      shouldBeRunning: true
    }
  ],
  healthCheck: {
    test: ['CMD', 'wget', '--tries=1', 'http://localhost:%port%'],
    retries: 5,
    startPeriod: 0,
    timeout: 5000,
    interval: 1000
  },
  cmd: ['start-notebook.sh', '--NotebookApp.token='],
  onHealthyActions: ['OPEN_SCIPY_NOTEBOOK'],
  tags: ['Application']
};

export default SCIPY_NOTEBOOK;

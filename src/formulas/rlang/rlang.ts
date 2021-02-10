/* eslint-disable @typescript-eslint/camelcase */
import { Formula } from '../../contracts/formula';
import logo from './logo.png';
import { FaRProject } from 'react-icons/fa';

const RLANG: Formula = {
  name: 'R',
  defaultShell: '/bin/bash',
  logo,
  description: 'R is a system for statistical computation and graphics.',
  website: 'https://www.r-project.org/',
  data: {
    name: {
      type: 'string',
      description: 'Name of the R instance',
      required: true
    },
    projects_folder: {
      type: 'path',
      description: 'Folder location where you have all your projects',
      hint: 'This folder will be mounted at /projects in the container',
      required: true
    }
  },
  volumes: {
    '/projects': '%projects_folder%'
  },
  isCli: true,
  image: 'library/r-base',
  env: {},
  actions: [
    {
      text: 'R REPL',
      value: 'R_REPL',
      exec: 'R',
      icon: FaRProject,
      shouldBeRunning: true
    }
  ],
  tags: ['Language']
};

export default RLANG;

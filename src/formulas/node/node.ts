/* eslint-disable @typescript-eslint/camelcase */
import { Formula } from '../../contracts/formula';
import logo from './logo.svg';
import { FaNodeJs } from 'react-icons/fa';

const NODE: Formula = {
  name: 'Node.js',
  defaultShell: '/bin/bash',
  description:
    'Node.js is a cross-platform, back-end JavaScript runtime environment',
  website: 'https://nodejs.org/',
  logo,
  data: {
    name: {
      type: 'string',
      description: 'Name of the Node.js instance',
      required: true
    },
    projects_folder: {
      type: 'path',
      description: 'Folder location where you have all your projects',
      hint: 'This folder will be mounted at /projects in the container',
      required: true
    }
  },
  isCli: true,
  image: 'library/node',
  volumes: {
    '/projects': '%projects_folder%'
  },
  env: {},
  actions: [
    {
      text: 'Node REPL',
      value: 'NODE_REPL',
      icon: FaNodeJs,
      exec: 'node',
      shouldBeRunning: true
    }
  ],
  tags: ['Language']
};

export default NODE;

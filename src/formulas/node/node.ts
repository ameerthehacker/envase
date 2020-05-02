import { Formula } from '../../contracts/formula';
import logo from './logo.svg';
import { FaNodeJs } from 'react-icons/fa';

const NODE: Formula = {
  name: 'Node.js',
  defaultShell: '/bin/bash',
  logo,
  data: {
    name: {
      type: 'string',
      description: 'Name of the Node.js instance',
      required: true
    },
    project: {
      type: 'path',
      description: 'Projects folder',
      required: true
    }
  },
  isCli: true,
  image: 'library/node',
  volumes: {
    '/projects': '%project%'
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

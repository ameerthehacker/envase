import { Formula } from '../../contracts/formula';
import logo from './logo.png';
import { FaPython } from 'react-icons/fa';

const PYTHON: Formula = {
  name: 'Python',
  defaultShell: '/bin/bash',
  logo,
  data: {
    name: {
      type: 'string',
      description: 'Name of the python instance',
      required: true
    },
    project: {
      type: 'path',
      description: 'Projects folder',
      required: true
    }
  },
  isCli: true,
  image: 'library/python',
  env: {},
  tags: ['Language'],
  volumes: {
    '/projects': '%project%'
  },
  actions: [
    {
      text: 'Python REPL',
      value: 'PYTHON_REPL',
      exec: 'python',
      icon: FaPython,
      shouldBeRunning: true
    }
  ]
};

export default PYTHON;

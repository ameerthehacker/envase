import { Formula } from '../../contracts/formula';
import logo from './logo.svg';

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
  env: {}
};

export default NODE;

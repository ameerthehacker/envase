import { Formula } from '../../contracts/formula';
import logo from './logo.png';

const PYTHON: Formula = {
  name: 'Python',
  shell: '/bin/bash',
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
  env: {}
};

export default PYTHON;

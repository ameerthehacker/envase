import { Formula } from '../../contracts/formula';
import logo from './logo.svg';

const GCC: Formula = {
  name: 'GCC',
  defaultShell: '/bin/bash',
  logo,
  data: {
    name: {
      type: 'string',
      description: 'Name of the GCC instance',
      required: true
    },
    project: {
      type: 'path',
      description: 'Projects folder',
      required: true
    }
  },
  isCli: true,
  image: 'library/gcc',
  env: {},
  tags: ['Language']
};

export default GCC;

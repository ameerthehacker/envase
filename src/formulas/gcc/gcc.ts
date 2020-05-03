/* eslint-disable @typescript-eslint/camelcase */
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
    projects_folder: {
      type: 'path',
      description: 'Folder location where you have all your projects',
      required: true
    }
  },
  volumes: {
    '/projects': '%projects_folder%'
  },
  isCli: true,
  image: 'library/gcc',
  env: {},
  tags: ['Language']
};

export default GCC;

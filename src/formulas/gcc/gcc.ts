/* eslint-disable @typescript-eslint/camelcase */
import { Formula } from '../../contracts/formula';
import logo from './logo.svg';

const GCC: Formula = {
  name: 'GCC',
  defaultShell: '/bin/bash',
  logo,
  description: 'GCC is a compiler supporting various programming languages',
  website: 'https://gcc.gnu.org/',
  data: {
    name: {
      type: 'string',
      description: 'Name of the GCC instance',
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
  image: 'library/gcc',
  env: {},
  tags: ['Language']
};

export default GCC;

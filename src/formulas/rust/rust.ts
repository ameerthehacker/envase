/* eslint-disable @typescript-eslint/camelcase */
import { Formula } from '../../contracts/formula';
import logo from './logo.png';

const RUST: Formula = {
  name: 'Rust',
  defaultShell: '/bin/bash',
  logo,
  data: {
    name: {
      type: 'string',
      description: 'Name of the rust instance',
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
  image: 'library/rust',
  env: {},
  tags: ['Language']
};

export default RUST;

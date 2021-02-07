/* eslint-disable @typescript-eslint/camelcase */
import { Formula } from '../../contracts/formula';
import logo from './logo.png';

const RUST: Formula = {
  name: 'Rust',
  defaultShell: '/bin/bash',
  logo,
  description:
    'Rust is a programming language designed for performance and safety',
  website: 'https://www.rust-lang.org/',
  data: {
    name: {
      type: 'string',
      description: 'Name of the rust instance',
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
  image: 'library/rust',
  env: {},
  tags: ['Language']
};

export default RUST;

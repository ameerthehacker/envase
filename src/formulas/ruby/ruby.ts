/* eslint-disable @typescript-eslint/camelcase */
import { Formula } from '../../contracts/formula';
import logo from './logo.png';

const RUBY: Formula = {
  name: 'Ruby',
  defaultShell: '/bin/bash',
  logo,
  description: 'Ruby is an interpreted, general-purpose programming language',
  website: 'https://www.ruby-lang.org/',
  data: {
    name: {
      type: 'string',
      description: 'Name of the Ruby instance',
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
  image: 'library/ruby',
  env: {},
  tags: ['Language']
};

export default RUBY;

/* eslint-disable @typescript-eslint/camelcase */
import { Formula } from '../../contracts/formula';
import logo from './logo.png';

const GIT: Formula = {
  name: 'Git',
  defaultShell: '/bin/bash',
  logo,
  description: 'Git is software for tracking changes in any set of files',
  website: 'https://git-scm.com/',
  data: {
    name: {
      type: 'string',
      description: 'Name of the Git instance',
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
  image: 'juracy/docker-git-scm',
  env: {},
  tags: ['Application']
};

export default GIT;

/* eslint-disable @typescript-eslint/camelcase */
import { Formula } from '../../contracts/formula';
import logo from './logo.svg';

const GOLANG: Formula = {
  name: 'Go',
  defaultShell: '/bin/bash',
  logo,
  data: {
    name: {
      type: 'string',
      description: 'Name of the golang instance',
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
  image: 'library/golang',
  env: {},
  tags: ['Language']
};

export default GOLANG;

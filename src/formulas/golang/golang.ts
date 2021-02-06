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
      description:
        'Folder location where you have all your go projects are located',
      hint: 'This folder will be mounted as $GOPATH in the container',
      required: true
    }
  },
  volumes: {
    '/go': '%projects_folder%'
  },
  isCli: true,
  image: 'library/golang',
  env: {},
  tags: ['Language']
};

export default GOLANG;

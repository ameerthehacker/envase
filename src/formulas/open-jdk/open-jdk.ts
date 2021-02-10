/* eslint-disable @typescript-eslint/camelcase */
import { Formula } from '../../contracts/formula';
import logo from './logo.png';

const OPEN_JDK: Formula = {
  name: 'OpenJDK',
  defaultShell: '/bin/bash',
  logo,
  description: 'OpenJDK is an open-source implementation of the Java Platform',
  website: 'https://openjdk.java.net/',
  data: {
    name: {
      type: 'string',
      description: 'Name of the OpenJDK instance',
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
  image: 'library/openjdk',
  env: {},
  tags: ['Language']
};

export default OPEN_JDK;

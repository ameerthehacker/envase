/* eslint-disable @typescript-eslint/camelcase */
import { Formula } from '../../contracts/formula';
import logo from './logo.png';
import { FaTerminal } from 'react-icons/fa';

const DENO: Formula = {
  name: 'Deno',
  defaultShell: '/bin/sh',
  logo,
  description:
    'Deno is a runtime for JavaScript and TypeScript built on the V8 engine',
  website: 'https://deno.land/',
  data: {
    name: {
      type: 'string',
      description: 'Name of the Deno instance',
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
  image: 'hayd/deno',
  env: {},
  actions: [
    {
      text: 'Deno REPL',
      value: 'DENO_REPL',
      exec: 'deno',
      icon: FaTerminal,
      shouldBeRunning: true
    }
  ],
  tags: ['Language']
};

export default DENO;

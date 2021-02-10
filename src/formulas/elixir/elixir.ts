/* eslint-disable @typescript-eslint/camelcase */
import { Formula } from '../../contracts/formula';
import logo from './logo.png';
import { FaTerminal } from 'react-icons/fa';

const ELIXIR: Formula = {
  name: 'elixir',
  defaultShell: '/bin/bash',
  logo,
  description:
    'elixir is a dynamic language for building scalable applications',
  website: 'https://elixir-lang.org/',
  data: {
    name: {
      type: 'string',
      description: 'Name of the elixir instance',
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
  image: 'library/elixir',
  env: {},
  actions: [
    {
      text: 'elixir REPL',
      value: 'ELIXIR_REPL',
      exec: 'iex',
      icon: FaTerminal,
      shouldBeRunning: true
    }
  ],
  tags: ['Language']
};

export default ELIXIR;

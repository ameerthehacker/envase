import { Formula } from '../../contracts/formula';
import logo from './logo.png';

const RUBY: Formula = {
  name: 'Ruby',
  defaultShell: '/bin/bash',
  logo,
  data: {
    name: {
      type: 'string',
      description: 'Name of the Ruby instance',
      required: true
    },
    project: {
      type: 'path',
      description: 'Projects folder',
      required: true
    }
  },
  volumes: {
    '/projects': '%project%'
  },
  isCli: true,
  image: 'library/ruby',
  env: {},
  tags: ['Language']
};

export default RUBY;

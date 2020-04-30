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
  isCli: true,
  image: 'library/ruby',
  env: {}
};

export default RUBY;
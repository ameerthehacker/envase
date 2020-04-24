import { Formula } from '../../contracts/formula';
import logo from './logo.svg';

const GOLANG: Formula = {
  name: 'Go',
  shell: '/bin/bash',
  logo,
  data: {
    name: {
      type: 'string',
      description: 'Name of the golang instance',
      required: true
    },
    project: {
      type: 'path',
      description: 'Projects folder',
      required: true
    }
  },
  isCli: true,
  image: 'library/golang',
  env: {}
};

export default GOLANG;

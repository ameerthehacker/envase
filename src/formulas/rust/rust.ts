import { Formula } from '../../contracts/formula';
import logo from './logo.png';

const RUST: Formula = {
  name: 'Rust',
  shell: '/bin/bash',
  logo,
  data: {
    name: {
      type: 'string',
      description: 'Name of the rust instance',
      required: true
    },
    project: {
      type: 'path',
      description: 'Projects folder',
      required: true
    }
  },
  isCli: true,
  image: 'library/rust',
  env: {}
};

export default RUST;

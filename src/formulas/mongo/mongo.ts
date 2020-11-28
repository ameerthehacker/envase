import { Formula } from '../../contracts/formula';
import logo from './logo.png';

const MONGO: Formula = {
  name: 'Mongo DB',
  logo,
  defaultShell: '/bin/bash',
  data: {
    name: {
      type: 'string',
      description: 'Name of the Mongo DB server instance',
      required: true
    },
    port: {
      type: 'number',
      description: 'Port on which Mongo DB server should run',
      default: 27017,
      required: true
    },
    data: {
      type: 'path',
      description: 'Database storage path for Mongo DB'
    }
  },
  image: 'library/mongo',
  env: {},
  ports: {
    3306: '%port%'
  },
  volumes: {
    '/data/db': '%data%'
  },
  tags: ['Database']
};

export default MONGO;

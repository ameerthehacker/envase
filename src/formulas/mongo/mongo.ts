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
    username: {
      type: 'string',
      description: 'Username for the Mongo DB instance',
      required: true
    },
    password: {
      type: 'password',
      description: 'Password for the user',
      required: true
    },
    data: {
      type: 'path',
      description: 'Database storage path for Mongo DB',
      required: true
    }
  },
  image: 'library/mongo',
  env: {
    MONGO_INITDB_ROOT_USERNAME: '%username%',
    MONGO_INITDB_ROOT_PASSWORD: '%password'
  },
  ports: {
    3306: '%port%'
  },
  volumes: {
    '/data/db': '%data%'
  },
  tags: ['Database']
};

export default MONGO;

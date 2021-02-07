import { Formula } from '../../contracts/formula';
import logo from './logo.png';

const COUCHDB: Formula = {
  name: 'Couch DB',
  logo,
  description:
    'CouchDB is an open-source NoSQL database, implemented in Erlang',
  website: 'https://couchdb.apache.org/',
  defaultShell: '/bin/bash',
  data: {
    name: {
      type: 'string',
      description: 'Name of the Couch DB server instance',
      required: true
    },
    port: {
      type: 'number',
      description: 'Port on which Couch DB server should run',
      default: 5984,
      required: true
    },
    username: {
      type: 'string',
      description: 'Username for Couch DB instance',
      required: true
    },
    password: {
      type: 'password',
      description: 'Password for the user',
      required: true
    },
    data: {
      type: 'path',
      description: 'Database storage path for Couch DB',
      required: true
    }
  },
  image: 'library/couchdb',
  env: {
    COUCHDB_USER: '%username%',
    COUCHDB_SECRET: '%password%',
    COUCHDB_PASSWORD: '%password%'
  },
  ports: {
    5984: '%port%'
  },
  volumes: {
    '/opt/couchdb/data': '%data%'
  },
  tags: ['Database']
};

export default COUCHDB;

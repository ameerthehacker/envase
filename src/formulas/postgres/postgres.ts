import { Formula } from '../../contracts/formula';
import logo from './logo.png';
import { FaPlug } from 'react-icons/fa';

const POSTGRES: Formula = {
  name: 'Postgres',
  logo,
  defaultShell: '/bin/bash',
  data: {
    name: {
      type: 'string',
      description: 'Name of the Postgres server instance',
      required: true
    },
    port: {
      type: 'number',
      description: 'Port on which Postgres server should run',
      default: 5432,
      required: true
    },
    user: {
      type: 'string',
      description: 'Username for the Postgres instance'
    },
    password: {
      type: 'password',
      description: 'Password for the user'
    },
    data: {
      type: 'path',
      description: 'Database storage path for Postgres'
    }
  },
  image: 'library/postgres',
  env: {
    POSTGRES_PASSWORD: '%password%',
    POSTGRES_USER: '%user%'
  },
  ports: {
    5432: '%port%'
  },
  volumes: {
    '/var/lib/postgresql/data': '%data%'
  },
  tags: ['Language'],
  actions: [
    {
      text: 'PSQL CLI',
      value: 'PSQL_CLI',
      exec: 'psql -U %user%',
      icon: FaPlug,
      shouldBeRunning: true
    }
  ]
};

export default POSTGRES;

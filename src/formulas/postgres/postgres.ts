import { Formula } from '../../contracts/formula';
import logo from './logo.png';

const POSTGRES: Formula = {
  name: 'Postgres',
  logo,
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
      description: 'Database storage path for Postgres',
      required: true
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
  }
};

export default POSTGRES;
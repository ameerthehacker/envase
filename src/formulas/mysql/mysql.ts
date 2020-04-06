import { Formula } from '../../contracts/formula';
import logo from './logo.svg';

const MYSQL: Formula = {
  name: 'MySQL',
  logo,
  data: {
    name: {
      type: 'string',
      description: 'Name of the MySQL server instance',
      required: true
    },
    port: {
      type: 'number',
      description: 'Port on which MySQL server should run',
      default: 3306,
      required: true
    },
    password: {
      type: 'password',
      description: 'Password for the root user'
    },
    data: {
      type: 'path',
      description: 'Database storage path for MySQL',
      required: true
    }
  },
  image: 'library/mysql',
  env: {
    MYSQL_ROOT_PASSWORD: '%password%'
  },
  ports: {
    3306: '%port%'
  },
  volumes: {
    '/var/lib/mysql': '%data%'
  }
};

export default MYSQL;

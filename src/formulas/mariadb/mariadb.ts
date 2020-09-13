import { Formula } from '../../contracts/formula';
import logo from './logo.svg';
import { FaPlug } from 'react-icons/fa';

const MARIADB: Formula = {
  name: 'MariaDB',
  logo,
  defaultShell: '/bin/bash',
  data: {
    name: {
      type: 'string',
      description: 'Name of the MariaDB server instance',
      required: true
    },
    port: {
      type: 'number',
      description: 'Port on which MariaDB server should run',
      default: 3306,
      required: true
    },
    password: {
      type: 'password',
      description: 'Password for the root user'
    },
    data: {
      type: 'path',
      description: 'Database storage path for MariaDB'
    }
  },
  image: 'library/mariadb',
  env: {
    MYSQL_ROOT_PASSWORD: '%password%'
  },
  ports: {
    3306: '%port%'
  },
  volumes: {
    '/var/lib/mysql': '%data%'
  },
  actions: [
    {
      text: 'Open MySQL CLI',
      value: 'OPEN_MYSQL_CLI',
      icon: FaPlug,
      exec: 'mysql -p',
      shouldBeRunning: true
    }
  ],
  tags: ['Database']
};

export default MARIADB;

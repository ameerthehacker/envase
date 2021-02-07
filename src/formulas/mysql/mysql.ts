import { Formula } from '../../contracts/formula';
import logo from './logo.svg';
import { FaPlug } from 'react-icons/fa';

const MYSQL: Formula = {
  name: 'MySQL',
  logo,
  defaultShell: '/bin/bash',
  description: 'MySQL is an open-source relational database management system',
  website: 'https://www.mysql.com/',
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
      description: 'Database storage path for MySQL'
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

export default MYSQL;

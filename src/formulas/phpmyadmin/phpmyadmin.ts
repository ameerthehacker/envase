/* eslint-disable @typescript-eslint/camelcase */
import { Formula } from '../../contracts/formula';
import logo from './logo.png';
import { FaPlug } from 'react-icons/fa';
import MYSQL from '../mysql/mysql';

const PHPMYADMIN: Formula = {
  name: 'phpMyAdmin',
  defaultShell: '/bin/bash',
  logo,
  data: {
    name: {
      type: 'string',
      description: 'Name of the phpMyAdmin instance',
      required: true
    },
    site_port: {
      type: 'number',
      description: 'Port on which phpMyAdmin will be available',
      default: 80,
      required: true
    },
    MySQL_username: {
      type: 'string',
      description: 'Username of the MySQL database',
      required: true
    },
    MySQL_password: {
      type: 'password',
      description: 'Password of the MySQL database'
    }
  },
  dependencies: [MYSQL],
  image: 'phpmyadmin/phpmyadmin',
  ports: {
    80: '%site_port%'
  },
  env: {
    PMA_HOST: '%MySQL%',
    PMA_USER: '%MySQL_username%',
    PMA_PASSWORD: '%MySQL_password%'
  },
  actions: [
    {
      text: 'Open phpMyAdmin',
      value: 'OPEN_PHPMYADMIN',
      icon: FaPlug,
      openInBrowser: 'http://localhost:%site_port%',
      shouldBeRunning: true
    }
  ],
  healthCheck: {
    test: ['CMD', 'curl', 'http://localhost'],
    retries: 10,
    startPeriod: 1000,
    timeout: 5000,
    interval: 1000
  },
  onHealthyActions: ['OPEN_PHPMYADMIN'],
  tags: ['Application']
};

export default PHPMYADMIN;

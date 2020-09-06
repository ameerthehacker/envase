/* eslint-disable @typescript-eslint/camelcase */
import { Formula } from '../../contracts/formula';
import logo from './logo.png';
import { FaWordpress } from 'react-icons/fa';
import MYSQL from '../mysql/mysql';

const WORDPRESS: Formula = {
  name: 'Wordpress',
  defaultShell: '/bin/bash',
  logo,
  data: {
    name: {
      type: 'string',
      description: 'Name of the Wordpress instance',
      required: true
    },
    site_port: {
      type: 'number',
      description: 'Port on which jenkins UI will be available',
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
    },
    MySQL_database_name: {
      type: 'string',
      description: 'Name of the MySQL database',
      required: true
    }
  },
  dependencies: [MYSQL],
  image: 'library/wordpress',
  ports: {
    80: '%site_port%'
  },
  env: {
    WORDPRESS_DB_HOST: '%MySQL%',
    WORDPRESS_DB_USER: '%MySQL_username%',
    WORDPRESS_DB_PASSWORD: '%MySQL_password%',
    WORDPRESS_DB_NAME: '%MySQL_database_name%'
  },
  actions: [
    {
      text: 'Open Wordpress Site',
      value: 'OPEN_WORDPRESS_SITE',
      icon: FaWordpress,
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
  onHealthyActions: ['OPEN_WORDPRESS_SITE'],
  tags: ['Application']
};

export default WORDPRESS;

/* eslint-disable @typescript-eslint/camelcase */
import { Formula } from '../../contracts/formula';
import logo from './logo.png';
import { FaJoomla } from 'react-icons/fa';
import MYSQL from '../mysql/mysql';

const JOOMLA: Formula = {
  name: 'Joomla',
  defaultShell: '/bin/bash',
  logo,
  description: 'Joomla is a free and open-source content management system',
  website: 'https://www.joomla.org/',
  data: {
    name: {
      type: 'string',
      description: 'Name of the Joomla instance',
      required: true
    },
    site_port: {
      type: 'number',
      description: 'Port on which Joomla site will be available',
      default: 8080,
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
  image: 'library/joomla',
  ports: {
    80: '%site_port%'
  },
  env: {
    JOOMLA_DB_HOST: '%MySQL%',
    JOOMLA_DB_USER: '%MySQL_username%',
    JOOMLA_DB_PASSWORD: '%MySQL_password%',
    JOOMLA_DB_NAME: '%MySQL_database_name%'
  },
  actions: [
    {
      text: 'Open Joomla Site',
      value: 'OPEN_JOOMLA_SITE',
      icon: FaJoomla,
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
  onHealthyActions: ['OPEN_JOOMLA_SITE'],
  tags: ['Application']
};

export default JOOMLA;

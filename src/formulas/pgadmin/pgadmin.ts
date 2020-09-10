import { Formula } from '../../contracts/formula';
import logo from './logo.png';
import { FaGlobe } from 'react-icons/fa';

const PGADMIN: Formula = {
  name: 'pgAdmin',
  logo,
  defaultShell: '/bin/sh',
  data: {
    name: {
      type: 'string',
      description: 'Name of the pgAdmin server instance',
      required: true
    },
    port: {
      type: 'number',
      description: 'Port on which pgAdmin server should run',
      default: 80,
      required: true
    },
    user: {
      type: 'string',
      description: 'Username for the pgAdmin instance'
    },
    password: {
      type: 'password',
      description: 'Password for the user'
    }
  },
  image: 'dpage/pgadmin4',
  env: {
    PGADMIN_DEFAULT_PASSWORD: '%password%',
    PGADMIN_DEFAULT_EMAIL: '%user%'
  },
  ports: {
    80: '%port%'
  },
  healthCheck: {
    test: ['CMD', 'wget', '-S', '--spider', 'http://localhost'],
    retries: 10,
    startPeriod: 1000,
    timeout: 10000,
    interval: 2000
  },
  onHealthyActions: ['OPEN_PGADMIN_UI'],
  tags: ['Application'],
  actions: [
    {
      text: 'Open pgAdmin UI',
      value: 'OPEN_PGADMIN_UI',
      openInBrowser: 'http://localhost:%port%',
      icon: FaGlobe,
      shouldBeRunning: true
    }
  ]
};

export default PGADMIN;

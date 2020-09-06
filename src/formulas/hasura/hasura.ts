/* eslint-disable @typescript-eslint/camelcase */
import { Formula } from '../../contracts/formula';
import logo from './logo.svg';
import { FaGlobe } from 'react-icons/fa';
import POSTGRES from '../postgres/postgres';

const HASURA: Formula = {
  name: 'Hasura',
  defaultShell: '/bin/sh',
  logo,
  data: {
    name: {
      type: 'string',
      description: 'Name of the Hasura instance',
      required: true
    },
    console_port: {
      type: 'number',
      description: 'Port on hasura console will be available',
      default: 8080,
      required: true
    },
    postgres_username: {
      type: 'string',
      description: 'Username of the postgres database',
      required: true
    },
    postgres_password: {
      type: 'password',
      description: 'Password of the postgres database'
    },
    postgres_database_name: {
      type: 'string',
      description: 'Name of the postgres database',
      required: true
    }
  },
  dependencies: [POSTGRES],
  image: 'hasura/graphql-engine',
  ports: {
    8080: '%console_port%'
  },
  env: {
    HASURA_GRAPHQL_DATABASE_URL:
      'postgres://%postgres_username%:%postgres_password%@%Postgres%:5432/%postgres_database_name%',
    HASURA_GRAPHQL_ENABLE_CONSOLE: 'true'
  },
  actions: [
    {
      text: 'Open Hasura Console',
      value: 'OPEN_HASURA_CONSOLE',
      icon: FaGlobe,
      openInBrowser: 'http://localhost:%console_port%',
      shouldBeRunning: true
    }
  ],
  healthCheck: {
    test: ['CMD', 'wget', '-S', '--spider', 'http://localhost:8080/console'],
    retries: 10,
    startPeriod: 1000,
    timeout: 5000,
    interval: 1000
  },
  onHealthyActions: ['OPEN_HASURA_CONSOLE'],
  tags: ['Application']
};

export default HASURA;

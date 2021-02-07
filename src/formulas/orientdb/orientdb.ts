/* eslint-disable @typescript-eslint/camelcase */
import { FaGlobe } from 'react-icons/fa';
import { Formula } from '../../contracts/formula';
import logo from './logo.png';

const ORIENTDB: Formula = {
  name: 'OrientDB',
  logo,
  defaultShell: '/bin/bash',
  description: 'OrientDB is a NoSQL database management system written in Java',
  website: 'https://www.orientdb.org/',
  data: {
    name: {
      type: 'string',
      description: 'Name of the OrientDB server instance',
      required: true
    },
    port: {
      type: 'number',
      description: 'Port on which OrientDB server should run',
      default: 2424,
      required: true
    },
    UI_port: {
      type: 'number',
      description: 'Port on which OrientDB UI should run',
      default: 2480,
      required: true
    },
    root_password: {
      type: 'password',
      description: 'Root password of OrientDB',
      required: true
    },
    data: {
      type: 'path',
      description: 'Database storage path for OrientDB'
    }
  },
  image: 'library/orientdb',
  env: {
    ORIENTDB_ROOT_PASSWORD: '%root_password%'
  },
  ports: {
    2424: '%port%',
    2480: '%UI_port%'
  },
  volumes: {
    '/orientdb/databases': '%data%'
  },
  actions: [
    {
      text: 'Open OrientDB UI',
      value: 'OPEN_ORIENTDB_UI',
      icon: FaGlobe,
      openInBrowser: 'http://localhost:%ui_port%',
      shouldBeRunning: true
    }
  ],
  tags: ['Database']
};

export default ORIENTDB;

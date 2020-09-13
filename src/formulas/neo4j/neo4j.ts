/* eslint-disable @typescript-eslint/camelcase */
import { FaGlobe } from 'react-icons/fa';
import { Formula } from '../../contracts/formula';
import logo from './logo.png';

const NEO4J: Formula = {
  name: 'neo4J',
  logo,
  defaultShell: '/bin/bash',
  data: {
    name: {
      type: 'string',
      description: 'Name of the neo4J DB server instance',
      required: true
    },
    port: {
      type: 'number',
      description: 'Port on which neo4J DB server should run',
      default: 7687,
      required: true
    },
    UI_port: {
      type: 'number',
      description: 'Port on which neo4J UI should run',
      default: 7474,
      required: true
    },
    data: {
      type: 'path',
      description: 'Database storage path for neo4J DB'
    }
  },
  image: 'library/neo4j',
  env: {
    NEO4J_AUTH: 'none'
  },
  ports: {
    7687: '%port%',
    7474: '%UI_port%'
  },
  volumes: {
    '/data': '%data%'
  },
  actions: [
    {
      text: 'Open neo4J UI',
      value: 'OPEN_NEO4J_UI',
      icon: FaGlobe,
      openInBrowser: 'http://localhost:%ui_port%',
      shouldBeRunning: true
    }
  ],
  tags: ['Database']
};

export default NEO4J;

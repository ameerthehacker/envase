import { Formula } from '../../contracts/formula';
import logo from './logo.png';
import ELASTICSEARCH from '../elasticsearch/elasticsearch';
import { FaGlobe } from 'react-icons/fa';

const KIBANA: Formula = {
  name: 'Kibana',
  logo,
  defaultShell: '/bin/bash',
  data: {
    name: {
      type: 'string',
      description: 'Name of the Kibana server instance',
      required: true
    },
    port: {
      type: 'number',
      description: 'Port on which Kibana server should run',
      default: 5601,
      required: true
    },
    config: {
      type: 'path',
      description: 'Path of Kibana config directory'
    }
  },
  env: {
    ELASTICSEARCH_HOSTS: 'http://%Elasticsearch%:9200'
  },
  image: 'library/kibana',
  ports: {
    5601: '%port%'
  },
  dependencies: [ELASTICSEARCH],
  volumes: {
    '/usr/share/kibana/config': '%config%'
  },
  actions: [
    {
      text: 'Open Kiabana Console',
      value: 'OPEN_KIBANA_CONSOLE',
      icon: FaGlobe,
      openInBrowser: 'http://localhost:%port%',
      shouldBeRunning: true
    }
  ],
  healthCheck: {
    test: ['CMD', 'curl', 'http://localhost:5601'],
    retries: 40,
    startPeriod: 3000,
    timeout: 120000,
    interval: 3000
  },
  onHealthyActions: ['OPEN_KIBANA_CONSOLE'],
  tags: ['Application']
};

export default KIBANA;

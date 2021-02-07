import { Formula } from '../../contracts/formula';
import logo from './logo.png';

const ELASTICSEARCH: Formula = {
  name: 'Elasticsearch',
  logo,
  defaultShell: '/bin/bash',
  description: 'Elasticsearch is a search engine based on the Lucene library',
  website: 'https://www.elastic.co/',
  data: {
    name: {
      type: 'string',
      description: 'Name of the Elasticsearch server instance',
      required: true
    },
    port: {
      type: 'number',
      description: 'Port on which Elasticsearch server should run',
      default: 9200,
      required: true
    },
    data: {
      type: 'path',
      description: 'Database storage path for Elasticsearch'
    }
  },
  image: 'library/elasticsearch',
  env: {
    'discovery.type': 'single-node'
  },
  ports: {
    9200: '%port%'
  },
  volumes: {
    '/usr/share/elasticsearch/data': '%data%'
  },
  tags: ['Database']
};

export default ELASTICSEARCH;

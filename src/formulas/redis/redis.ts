import { Formula } from '../../contracts/formula';
import logo from './logo.svg';

const REDIS: Formula = {
  name: 'Redis',
  defaultShell: '/bin/bash',
  logo,
  description: 'Redis is an in-memory data structure store',
  website: 'https://redis.io/',
  data: {
    name: {
      type: 'string',
      description: 'Name of the Redis server instance',
      required: true
    },
    port: {
      type: 'number',
      description: 'Port on which Redis server should run',
      default: 6379,
      required: true
    },
    data: {
      type: 'path',
      description: 'Database storage path for Redis',
      required: true
    }
  },
  image: 'library/redis',
  env: {},
  ports: {
    6379: '%port%'
  },
  volumes: {
    '/data': '%data%'
  },
  tags: ['Database']
};

export default REDIS;

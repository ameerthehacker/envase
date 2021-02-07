import { Formula } from '../../contracts/formula';
import logo from './logo.png';

const RABBITMQ: Formula = {
  name: 'RabbitMQ',
  logo,
  defaultShell: '/bin/bash',
  description: 'RabbitMQ is an open-source message-broker software',
  website: 'https://www.rabbitmq.com/',
  data: {
    name: {
      type: 'string',
      description: 'Name of the RabbitMQ server instance',
      required: true
    },
    port: {
      type: 'number',
      description: 'Port on which RabbitMQ server should run',
      default: 5672,
      required: true
    }
  },
  image: 'library/rabbitmq',
  ports: {
    5672: '%port%'
  },
  env: {},
  tags: ['Database']
};

export default RABBITMQ;

import { Formula } from '../../contracts/formula';
import logo from './logo.png';

const DYNAMODB: Formula = {
  name: 'Dynamo DB',
  logo,
  defaultShell: '/bin/bash',
  data: {
    name: {
      type: 'string',
      description: 'Name of the Dynamo DB server instance',
      required: true
    },
    port: {
      type: 'number',
      description: 'Port on which Dynamo DB server should run',
      default: 8000,
      required: true
    }
  },
  image: 'amazon/dynamodb-local',
  env: {},
  ports: {
    8000: '%port%'
  },
  tags: ['Database']
};

export default DYNAMODB;

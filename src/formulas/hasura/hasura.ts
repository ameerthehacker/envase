import { Formula } from '../../contracts/formula';
import logo from './logo.svg';

const HASURA: Formula = {
  name: 'Hasura',
  logo,
  data: {
    name: {
      type: 'string',
      description: 'Name of the Hasura instance',
      required: true
    },
    port: {
      type: 'number',
      description: 'Port on which Hasura should run',
      default: 8080,
      required: true
    },
    database: {
      type: 'string',
      description: 'Hasura graphql database url'
    }
  },
  image: 'hasura/graphql-engine',
  env: {
    HASURA_GRAPHQL_DATABASE_URL: '%database%',
    HASURA_GRAPHQL_ENABLE_CONSOLE: 'true'
  },
  ports: {
    8080: '%port%'
  }
};

export default HASURA;

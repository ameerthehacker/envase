import { FaGlobe } from 'react-icons/fa';
import { Formula } from '../../contracts/formula';
import MONGO from '../mongo/mongo';
import logo from './logo.png';

const MONGO_EXPRESS: Formula = {
  name: 'Mongo Express',
  logo,
  defaultShell: '/bin/bash',
  description: 'Web-based MongoDB admin interface',
  website: 'https://github.com/mongo-express/mongo-express',
  data: {
    name: {
      type: 'string',
      description: 'Name of the Mongo Express server instance',
      required: true
    },
    port: {
      type: 'number',
      description: 'Port on which Mongo Express server should run',
      default: 8081,
      required: true
    }
  },
  image: 'library/mongo-express',
  dependencies: [MONGO],
  env: {
    ME_CONFIG_MONGODB_SERVER: '%Mongo DB%'
  },
  actions: [
    {
      text: 'Open Mongo Express',
      value: 'OPEN_MONGO_EXPRESS',
      icon: FaGlobe,
      openInBrowser: 'http://localhost:%port%',
      shouldBeRunning: true
    }
  ],
  healthCheck: {
    test: ['CMD', 'wget', '-S', '--spider', 'http://localhost:8081'],
    retries: 10,
    startPeriod: 1000,
    timeout: 5000,
    interval: 1000
  },
  onHealthyActions: ['OPEN_MONGO_EXPRESS'],
  ports: {
    8081: '%port%'
  },
  tags: ['Application']
};

export default MONGO_EXPRESS;

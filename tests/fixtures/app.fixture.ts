import { Formula } from '../../src/contracts/formula';

const FORMULA: Formula = {
  name: 'MySQL',
  defaultShell: '/bin/bash',
  logo: 'some-logo',
  image: 'some-container-image',
  env: {
    PORT: '%port%',
    PASSWORD: '%password%',
    USERNAME: '%username%'
  },
  data: {
    port: {
      type: 'number',
      description: 'Port number of MySQL'
    },
    username: {
      type: 'string',
      description: 'MySQL username'
    },
    password: {
      type: 'password',
      description: 'MySQL password'
    }
  }
};

export { FORMULA };

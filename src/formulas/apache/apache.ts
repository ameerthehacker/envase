/* eslint-disable @typescript-eslint/camelcase */
import { Formula } from '../../contracts/formula';
import logo from './logo.png';
import { FaGlobe } from 'react-icons/fa';

const APACHE: Formula = {
  name: 'Apache',
  defaultShell: '/bin/bash',
  logo,
  data: {
    name: {
      type: 'string',
      description: 'Name of the Apache instance',
      required: true
    },
    port: {
      type: 'number',
      description: 'Port on which Apache server should run',
      default: 8080,
      required: true
    },
    static_files_folder: {
      type: 'path',
      description: 'Folder where the static files to be served are present'
    },
    configurations_folder: {
      type: 'path',
      description: 'Folder where Apache configurations should be stored'
    }
  },
  image: 'library/httpd',
  ports: {
    80: '%port%'
  },
  env: {},
  volumes: {
    '/usr/local/apache2/htdocs': '%static_files_folder%',
    '/usr/local/apache2/conf/': '%configurations_folder%'
  },
  actions: [
    {
      text: 'Open Website',
      value: 'OPEN_WEBSITE',
      icon: FaGlobe,
      openInBrowser: 'http://localhost:%port%',
      shouldBeRunning: true
    }
  ],
  tags: ['Application']
};

export default APACHE;

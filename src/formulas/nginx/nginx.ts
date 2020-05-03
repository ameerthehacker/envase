/* eslint-disable @typescript-eslint/camelcase */
import { Formula } from '../../contracts/formula';
import logo from './logo.png';
import { FaGlobe } from 'react-icons/fa';

const NGINX: Formula = {
  name: 'Nginx',
  defaultShell: '/bin/bash',
  logo,
  data: {
    name: {
      type: 'string',
      description: 'Name of the Nginx instance',
      required: true
    },
    port: {
      type: 'number',
      description: 'Port on which Nginx server should run',
      default: 80,
      required: true
    },
    static_files_folder: {
      type: 'path',
      description: 'Folder where the static files to be served are present',
      required: true
    },
    configurations_folder: {
      type: 'path',
      description: 'Folder where Nginx configurations should be stored'
    }
  },
  image: 'library/nginx',
  ports: {
    80: '%port%'
  },
  env: {},
  volumes: {
    '/usr/share/nginx/html': '%static_files_folder%',
    '/etc/nginx/': '%configurations_folder%'
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

export default NGINX;

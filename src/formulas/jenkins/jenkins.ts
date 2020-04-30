/* eslint-disable @typescript-eslint/camelcase */
import { Formula } from '../../contracts/formula';
import logo from './logo.svg';
import { FaJenkins } from 'react-icons/fa';

const JENKINS: Formula = {
  name: 'Jenkins',
  defaultShell: '/bin/bash',
  logo,
  data: {
    name: {
      type: 'string',
      description: 'Name of the Jenkins instance',
      required: true
    },
    ui_port: {
      type: 'number',
      description: 'Port on which jenkins UI will be available',
      default: 8080,
      required: true
    },
    jenkins_home: {
      type: 'path',
      description: 'Home directory for Jenkins',
      required: true
    }
  },
  image: 'library/jenkins',
  ports: {
    8080: '%ui_port%'
  },
  env: {},
  actions: [
    {
      text: 'Open Jenkins UI',
      value: 'OPEN_JENKINS_UI',
      icon: FaJenkins,
      openInBrowser: 'http://localhost:%ui_port%',
      shouldBeRunning: true
    }
  ]
};

export default JENKINS;

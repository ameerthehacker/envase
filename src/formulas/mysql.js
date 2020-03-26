module.exports = {
  data: {
    name: {
      type: 'string',
      description: 'Name of the MySQL server instance',
      required: true
    },
    port: {
      type: 'number',
      description: 'Port on which MySQL server should run',
      default: 3306
    },
    password: {
      type: 'password',
      description: 'Password for the root user'
    },
    data: {
      type: 'string',
      description: 'Database storage path for MySQL',
      required: true
    }
  },
  image: 'mysql',
  env: {
    MYSQL_ROOT_PASSWORD: '%password%'
  }
};

module.exports = {
  data: {
    name: {
      type: "string",
      descrption: "Name of the MySQL server instance",
      required: true
    },
    port: {
      type: "number",
      descrption: "Port on which MySQL server should run",
      default: 3306
    },
    password: {
      type: "password",
      descrption: "Password for the root user"
    },
    data: {
      type: "string",
      descrption: "Database storage path for MySQL",
      required: true
    }
  },
  image: "mysql",
  env: {
    MYSQL_ROOT_PASSWORD: "%password%"
  }
};

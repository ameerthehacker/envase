import MYSQL from './mysql/mysql';
import VSCODE from './vsode/vscode';
import NODE from './node/node';
import POSTGRES from './postgres/postgres';
import REDIS from './redis/redis';
import GOLANG from './golang/golang';
import RUST from './rust/rust';
import PYTHON from './python/python';
import COUCHDB from './couchdb/couchdb';
import GCC from './gcc/gcc';
import JENKINS from './jenkins/jenkins';
import MONGO from './mongo/mongo';
import RUBY from './ruby/ruby';
import SCIPY_NOTEBOOK from './scipy-notebook/scipy-notebook';
import NGINX from './nginx/nginx';
import HASURA from './hasura/hasura';
import WORDPRESS from './wordpress/wordpress';
import PHPMYADMIN from './phpmyadmin/phpmyadmin';
import ELASTICSEARCH from './elasticsearch/elasticsearch';
import KIBANA from './kibana/kibana';
import PGADMIN from './pgadmin/pgadmin';
import RABBITMQ from './rabbitmq/rabbitmq';
import APACHE from './apache/apache';
import JOOMLA from './joomla/joomla';
import MARIADB from './mariadb/mariadb';
import NEO4J from './neo4j/neo4j';

const FORMULAS = [
  MYSQL,
  MARIADB,
  PHPMYADMIN,
  WORDPRESS,
  JOOMLA,
  VSCODE,
  NODE,
  POSTGRES,
  PGADMIN,
  HASURA,
  REDIS,
  GOLANG,
  RUST,
  PYTHON,
  COUCHDB,
  GCC,
  JENKINS,
  MONGO,
  RUBY,
  APACHE,
  NGINX,
  ELASTICSEARCH,
  KIBANA,
  RABBITMQ,
  NEO4J,
  SCIPY_NOTEBOOK
];

export { FORMULAS };

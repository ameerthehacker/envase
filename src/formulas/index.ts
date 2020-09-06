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
import SCIPY_NOTBOOK from './scipy-notebook/scipy-notebook';
import NGINX from './nginx/nginx';
import HASURA from './hasura/hasura';
import WORDPRESS from './wordpress/wordpress';
import PHPMYADMIN from './phpmyadmin/phpmyadmin';

const FORMULAS = [
  MYSQL,
  PHPMYADMIN,
  WORDPRESS,
  VSCODE,
  NODE,
  POSTGRES,
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
  SCIPY_NOTBOOK,
  NGINX
];

export { FORMULAS };

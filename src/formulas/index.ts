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

const FORMULAS = [
  MYSQL,
  VSCODE,
  NODE,
  POSTGRES,
  REDIS,
  GOLANG,
  RUST,
  PYTHON,
  COUCHDB,
  GCC
];

export { FORMULAS };

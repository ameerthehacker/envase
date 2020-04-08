import MYSQL from './mysql/mysql';
import VSCODE from './vsode/vscode';
import NODE from './node/node';
import POSTGRES from './postgres/postgres';
import REDIS from './redis/redis';
import HASURA from './hasura/hasura';

const FORMULAS = [MYSQL, VSCODE, NODE, POSTGRES, REDIS, HASURA];

export { FORMULAS };

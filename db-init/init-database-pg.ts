

import * as fs from 'fs';
import * as pg from 'pg';
import * as dotenv from 'dotenv';

const envConfig = dotenv.parse(fs.readFileSync(process.env.CONFIG_PATH || 'develop.env'));

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = envConfig;
const Client = pg.Client;

export async function initPgDataBase() {
  const client = new Client({
    user: "postgres",
    host: DB_HOST,
    database: "postgres",
    password: DB_PASSWORD,
    port: DB_PORT,
  });
  try {
    await client.connect();
  } catch (e) {
    console.log('connect')
    throw (e)
  }
  try {
    await client.query(`create database ${DB_NAME}`);
    console.log(`create database ${DB_NAME} success`);
  } catch (e) {
    console.log(`database ${DB_NAME} already exists`);
  } finally {
    await client.end();
  }
}



import * as fs from 'fs';
import * as mysql from 'mysql';
import * as mysql2 from 'mysql2';
import * as dotenv from 'dotenv';

const envConfig = dotenv.parse(fs.readFileSync(process.env.CONFIG_PATH || 'develop.env'));

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = envConfig;


export async function fixMysql8Sha2Password() {
  const connection = await mysql2.createConnection({
    host: DB_HOST,
    user: DB_USERNAME,
    port: DB_PORT,
    password: DB_PASSWORD,
  })
  await connection.promise().query(`alter user '${DB_USERNAME}'@'%' identified with mysql_native_password by '${DB_PASSWORD}'`);
  await connection.end()
}

export async function initDataBase() {
  const connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USERNAME,
    port: DB_PORT,
    password: DB_PASSWORD,
  })
  return new Promise((resolve, reject) => {
    connection.connect((err: any) => {
      if (err) throw reject(err);
      connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME} DEFAULT CHARACTER SET 'utf8mb4'`, (err: any) => {
        if (err) {
          console.log('err', err)
          throw err;
        }
        console.log(`success init database ${DB_NAME}`);
        connection.end();
        resolve();
      });
    });
  })
}

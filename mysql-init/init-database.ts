

import * as fs from 'fs';
import * as mysql from 'mysql';
import { createConnection } from 'typeorm';
import * as dotenv from 'dotenv';



const envConfig = dotenv.parse(fs.readFileSync(process.env.CONFIG_PATH || 'develop.env'));


const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = envConfig;


const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USERNAME,
  port: DB_PORT,
  password: DB_PASSWORD,
})

export async function initDataBase() {
  return new Promise((resolve, reject) => {
    connection.connect((err: any) => {
      let count = 0
      if (err) throw reject(err);
      connection.query(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${DB_NAME}'`, (err: any, result: any) => {
        if (err) throw err;
        if (result.length === 0) {
          global.firstInitingDataBase = true;
        }
        connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME} DEFAULT CHARACTER SET 'utf8mb4'`, (err: any, result: any) => {
          if (err) throw reject(err);
          console.log(`success init database ${DB_NAME}`);
          connection.end();
          resolve();
        });
      })
      
    });
  })
}



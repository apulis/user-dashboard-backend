

import * as fs from 'fs';
import * as mysql from 'mysql2';
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
      if (err) throw reject(err);
      connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME} DEFAULT CHARACTER SET 'utf8mb4'`, (err: any) => {
        if (err) throw err;
        console.log(`success init database ${DB_NAME}`);
        connection.end();
        resolve();
      });
    });
  })
}

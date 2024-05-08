import mysql2 from "mysql2";
const config = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    dialect: "mysql",
    dialectModule: mysql2,
    dialectOptions: { decimalNumbers: true },
  },
  test: {
    storage: ":memory",
    dialect: "sqlite",
  },
  staging: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    logging: false,
    dialect: "mysql",
    dialectModule: mysql2,
    dialectOptions: { decimalNumbers: true },
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    logging: false,
    dialect: "mysql",
    dialectModule: mysql2,
    dialectOptions: { decimalNumbers: true },
  },
};

export default config;

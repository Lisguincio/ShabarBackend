import { Sequelize } from "sequelize";

import customEnv from "custom-env";
customEnv.env("local");

const sequelize = new Sequelize(
  process.env.DBNAMEMYSQL,
  process.env.USERNAMEMYSQL,
  process.env.PASSWORDMYSQL,
  {
    query: { raw: true },
    dialect: "mysql",
    host: process.env.HOSTMYSQL,
    port: process.env.PORTMYSQL || 3306,
    //logging: false,
  }
);

export default sequelize;

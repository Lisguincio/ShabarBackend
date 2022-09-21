import { Sequelize } from "sequelize";

import customEnv from "custom-env";
customEnv.env("local");

const sequelize = new Sequelize(
  process.env.MYSQLDATABASE,
  process.env.MYSQLUSER,
  process.env.MYSQLPASSWORD,
  {
    query: { raw: true },
    dialect: "mysql",
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT || 3306,
    //logging: false,
  }
);

export default sequelize;

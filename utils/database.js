import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./dbShabar.db", // Specifica il file SQLite dove verranno salvati i dati
  logging: (sql, { bind }) => {
    console.log(sql);
    console.log(bind);
  },
  //logging: false, // Puoi disabilitare il logging se non necessario
});

export default sequelize;

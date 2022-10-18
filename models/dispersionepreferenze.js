import { DataTypes } from "sequelize";
import { Op } from "sequelize";

import sequelize from "../utils/database.js";

const DispersionePreferenza = sequelize.define("dispersionepreferenza", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  extUser: {
    type: DataTypes.INTEGER,
  },
  dolce: {
    type: DataTypes.INTEGER, //da 0 a 10;
    allowNull: false,
  },
  secco: {
    type: DataTypes.INTEGER, //da 0 a 10;
  },
  speziato: {
    type: DataTypes.INTEGER, //da 0 a 10;
  },
  aspro: {
    type: DataTypes.INTEGER, //da 0 a 10;
  },
  frizzante: {
    type: DataTypes.INTEGER, //da 0 a 10;
  },
  amarognolo: {
    type: DataTypes.INTEGER, //da 0 a 10;
  },
});

export default DispersionePreferenza;

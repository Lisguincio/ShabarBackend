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
  dolcezza: {
    type: DataTypes.FLOAT, //da 0 a 10;
  },
  secco: {
    type: DataTypes.FLOAT, //da 0 a 10;
  },
  speziato: {
    type: DataTypes.FLOAT, //da 0 a 10;
  },
});

export default DispersionePreferenza;

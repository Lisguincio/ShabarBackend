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
  d_dolcezza: {
    type: DataTypes.FLOAT, //da 0 a 10;
  },
  d_secco: {
    type: DataTypes.FLOAT, //da 0 a 10;
  },
  d_speziato: {
    type: DataTypes.FLOAT, //da 0 a 10;
  },
});

export default DispersionePreferenza;

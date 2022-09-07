import sequelize from "../utils/database.js";
import { DataTypes } from "sequelize";

const UserPrefs = sequelize.define("userpref", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  extUser: {
    type: DataTypes.INTEGER,
    allowNull: false,
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

export const getUserPrefs = (email) => {
  return UserPrefs.findOne({ where: { email } });
};

export default UserPrefs;

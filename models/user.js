import { DataTypes } from "sequelize";

import sequelize from "../utils/database.js";

const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  profileIMG: {
    type: DataTypes.STRING,
  },
});

export const getUserByEmail = async (email) => {
  const user = await User.findOne({ where: { email } });
  return user;
};
export default User;

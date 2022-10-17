import { DataTypes, QueryTypes } from "sequelize";
import { Op } from "sequelize";

import sequelize from "../utils/database.js";

const Favorite = sequelize.define("favorite", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  extKeyUser: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  extKeyDrink: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Favorite;

export const isFavorite = async (extKeyUser, extKeyDrink) => {
  const isFavorite =
    (await Favorite.findOne({
      where: { extKeyUser, extKeyDrink },
    })) !== null;
  return isFavorite;
};

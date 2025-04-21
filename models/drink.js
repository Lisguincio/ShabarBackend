import { DataTypes, QueryTypes } from "sequelize";
import { Op } from "sequelize";

import sequelize from "../utils/database.js";
import Recipe from "./recipe.js";

const Drink = sequelize.define("drink", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT("long"),
  },
  grade_low: {
    type: DataTypes.INTEGER, //da 0 a 100;
    allowNull: false,
  },
  grade_high: {
    type: DataTypes.INTEGER, //da 0 a 100;
    allowNull: false,
  },
  sweet: {
    type: DataTypes.INTEGER, //da 0 a 10;
    allowNull: false,
  },
  dry: {
    type: DataTypes.INTEGER, //da 0 a 10;
  },
  spiced: {
    type: DataTypes.INTEGER, //da 0 a 10;
  },
  sour: {
    type: DataTypes.INTEGER, //da 0 a 10;
  },
  fizzy: {
    type: DataTypes.INTEGER, //da 0 a 10;
  },
  bitter: {
    type: DataTypes.INTEGER, //da 0 a 10;
  },
  herbal: {
    type: DataTypes.INTEGER, //da 0 a 10;
  },
  fruity: {
    type: DataTypes.INTEGER, //da 0 a 10;
  },
});

export default Drink;

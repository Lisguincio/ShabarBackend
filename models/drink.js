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
  grade_min: {
    type: DataTypes.INTEGER, //da 0 a 100;
    allowNull: false,
  },
  grade_max: {
    type: DataTypes.INTEGER, //da 0 a 100;
    allowNull: false,
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

export default Drink;

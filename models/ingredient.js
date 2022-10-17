import { DataTypes } from "sequelize";

import sequelize from "../utils/database.js";
import Recipe from "./recipe.js";

const Ingredient = sequelize.define("ingredient", {
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
  multiplier: {
    type: DataTypes.DECIMAL(10, 1), //0 INGREDIENTE NORMALE, 1 INGREDIENTI NON QUANTIFICABILI, 2 INGREDIENTI NON  -->> E' un moltiplicatore: Acqua x0; Liquori x1; Menta x0.2---
    defaultValue: "1",
  },
  grade_min: {
    type: DataTypes.INTEGER, //da 0 a 100;
    allowNull: false,
  },
  grade_max: {
    type: DataTypes.STRING, //da 0 a 100;
    allowNull: false,
  },
  dolcezza: {
    type: DataTypes.INTEGER, //da 0 a 10;
    allowNull: false,
  },
  secco: {
    type: DataTypes.INTEGER, //da 0 a 10;
  },
  speziato: {
    type: DataTypes.INTEGER, //da 0 a 10;
  },
});

export default Ingredient;

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
    validate: {
      min: 0, // Valore minimo
      max: 1, // Valore massimo
    },
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

export default Ingredient;

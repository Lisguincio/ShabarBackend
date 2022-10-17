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

export async function findMyDrinkTemp(min1, min2, moltiplicatore, prefs) {
  const min1_minus = min1[2] - min1[1] * moltiplicatore;
  const min1_max = min1[2] + min1[1] * moltiplicatore;
  const min2_minus = min2[2] - min2[1] * moltiplicatore;
  const min2_max = min2[2] + min2[1] * moltiplicatore;

  const drinkstemp = await sequelize.query(
    `SELECT * FROM drinks where 
  ${min1[0].substring(
    2,
    min1[0].length
  )} between ${min1_minus} and ${min1_max} AND
  ${min2[0].substring(
    2,
    min2[0].length
  )} between ${min2_minus} and ${min2_max}`,
    { type: QueryTypes.SELECT }
  );

  console.log(drinkstemp);
  if (drinkstemp.length === 0) {
    moltiplicatore++;
    return findMyDrinkTemp(min1, min2, moltiplicatore, prefs);
  } else {
    const iterazioni = moltiplicatore;
    return { drinkstemp, iterazioni };
  }
}
export async function findMyDrink(range, moltiplicatore, prefs, iterazioni) {
  const { d_dolcezza, d_secco, d_speziato } = range;

  const drinks = await Drink.findAll({
    where: {
      secco: {
        [Op.between]: [
          prefs.secco - d_secco * moltiplicatore,
          prefs.secco + d_secco * moltiplicatore,
        ],
      },
      speziato: {
        [Op.between]: [
          prefs.speziato - d_speziato * moltiplicatore,
          prefs.speziato + d_speziato * moltiplicatore,
        ],
      },
      dolcezza: {
        [Op.between]: [
          prefs.dolcezza - d_dolcezza * moltiplicatore,
          prefs.dolcezza + d_dolcezza * moltiplicatore,
        ],
      },
    },
  });
  console.log("moltiplicatore: ", moltiplicatore);
  console.log("iterazioni: ", iterazioni);
  console.log("drinks.length: ", drinks.length);
  if (drinks.length < 3 && moltiplicatore < 2 * iterazioni) {
    moltiplicatore++;
    return findMyDrink(range, moltiplicatore, prefs, iterazioni);
  } else {
    console.log("drinks:", drinks);
    return drinks;
  }
}

export default Drink;

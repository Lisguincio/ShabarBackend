import sequelize from "../utils/database.js";
import { DataTypes } from "sequelize";
import Drink from "./drink.js";
import Ingredient from "./ingredient.js";

const Recipe = sequelize.define("recipe", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },

  extKeyDrink: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  extKeyIngredient: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  qty: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 0,
  },

  rate: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

Recipe.afterCreate(async (recipe) => {
  console.log("Create ->");
  const { extKeyDrink, extKeyIngredient, rate, qty } = recipe;

  const ingredient = await Ingredient.findByPk(extKeyIngredient, {
    attributes: {
      exclude: ["id", "name", "updatedAt", "createdAt"],
    },
  });

  const multiplier = ingredient.multiplier;

  delete ingredient.multiplier;

  const drink = await Drink.findByPk(extKeyDrink, {
    raw: false,
  });

  //console.log(drink);

  Object.entries(ingredient).forEach(([key, value]) => {
    console.log(key, (value * qty) / 100);
    drink.increment({
      [key]: (value * qty) / 100,
    });

    /* await drink.increment({
    dolce: (dolce * rate) / 100,
    secco: (secco * rate) / 100,
    speziato: (speziato * rate) / 100,
  }); */
  });
});

Recipe.afterDestroy(async (recipe) => {
  console.log("destroy: ", recipe);
  const { extKeyDrink, extKeyIngredient, qty } = recipe;
  const ingredient = await Ingredient.findByPk(extKeyIngredient);

  const { dolcezza, secco, speziato } = ingredient;

  const drink = await Drink.findByPk(extKeyDrink);

  drink.decrement({
    dolcezza: (dolcezza * qty) / 100,
    secco: (secco * qty) / 100,
    speziato: (speziato * qty) / 100,
  });
});

Recipe.afterUpdate(async (recipe) => {
  console.log("Update ->");
  const { extKeyDrink, extKeyIngredient, qty } = recipe;

  console.log(recipe);
  const value = Recipe.findAll({
    where: {
      extKeyDrink: recipe.extKeyDrink,
    },
  });
});

export default Recipe;

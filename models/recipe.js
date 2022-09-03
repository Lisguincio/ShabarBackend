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
});

Recipe.afterCreate(async (recipe) => {
  console.log("Create ->");
  const { extKeyDrink, extKeyIngredient, qty } = recipe;

  const ingredient = await Ingredient.findByPk(extKeyIngredient);

  const { dolcezza, secco, speziato } = ingredient;

  const drink = await Drink.findByPk(extKeyDrink);

  drink.increment({
    dolcezza: (dolcezza * qty) / 100,
    secco: (secco * qty) / 100,
    speziato: (speziato * qty) / 100,
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

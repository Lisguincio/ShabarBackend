import Drink from "../models/drink.js";
import Ingredient from "../models/ingredient.js";

export const getDrinkImage = async (req, res) => {
  const { id } = req.params;
  const drink = await Drink.findByPk(id);
  res.redirect(
    `https://storage.googleapis.com/shabar-public/public/images/Drinks/${drink.id}.png`
  );

  return;
};

export const getIngredientImage = async (req, res) => {
  const { id } = req.params;
  const ingredient = await Ingredient.findByPk(id);
  res.redirect(
    `https://storage.googleapis.com/shabar-public/public/images/Ingredienti/${ingredient.id}.png`
  );
  return;
};

import Recipe from "../../models/recipe.js";

export const getIngredients = async (extKeyDrink) => {
  const recipes = await Recipe.findAll({
    where: { extKeyDrink },
  });

  const ingredients = recipes.flatMap((recipe) => ({
    id: recipe.extKeyIngredient,
    quantity: recipe.qty,
  }));
  return ingredients;
};

export default getIngredients;

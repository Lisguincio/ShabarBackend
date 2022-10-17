import Ingredient from "../../models/ingredient.js";

const getIngredient = async (extKeyIngredient) => {
  const data = await Ingredient.findByPk(extKeyIngredient);
  return data;
};

export default getIngredient;

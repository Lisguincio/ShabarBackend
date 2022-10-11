import User, { getUserByEmail } from "../models/user.js";
import UserPrefs from "../models/usersprefs.js";
import { findMyDrink, findMyDrinkTemp, getDrink } from "../models/drink.js";
import Drink from "../models/drink.js";
import DispersionePreferenza from "../models/dispersionepreferenze.js";
import scelteUtente from "../models/scelteUtente.js";
import Recipe from "../models/recipe.js";
import Ingredient from "../models/ingredient.js";
import Favorite, {
  getFavoriteList,
  isFavorite,
  ToggleFavorite,
} from "../models/favorite.js";

export const getAllDrinks = async (req, res, next) => {
  const email = res.locals.email;

  let drinks = [];
  const drinklist = await Drink.findAll();

  const user = await getUserByEmail(email);

  console.log(drinklist);
  for (const drink of drinklist) {
    const drinkTemp = await getDrink(drink.id);
    const favorite = await isFavorite(user.id, drink.id);

    drinks.push({ ...drinkTemp, isFavorite: favorite });
  }

  res.status(200).json(drinks);
};

export const fetchDrink = async (req, res) => {
  const { extKeyDrink } = req.params;
  const email = res.locals.email;

  const user = await getUserByEmail(email);

  const drink = await getDrink(extKeyDrink);
  const favorite = await isFavorite(user.id, extKeyDrink);

  return res.status(200).json({ ...drink, isFavorite: favorite });
};

export const drinkIngredients = async (req, res, next) => {
  let data = [];
  const { extKeyDrink } = req.params;

  const recipes = await Recipe.findAll({
    where: { extKeyDrink: extKeyDrink },
  });

  const ingredients = await Ingredient.findAll({
    where: { id: recipes.map((recipe) => recipe.extKeyIngredient) },
  });

  ingredients.forEach((ingredient, index) => {
    data.push({ ...ingredient, quantity: recipes[index].qty });
  });

  res.status("200").json(data);
};

export const fetchFavorites = async (req, res) => {
  const email = res.locals.email;
  const user = await getUserByEmail(email);

  const favorites = await getFavoriteList(user.id);

  let arrayFavorites = [];
  for (let favorite of favorites) {
    const drink = await getDrink(favorite.extKeyDrink);
    arrayFavorites.push({ ...drink, isFavorite: true });
  }

  res.status(200).json(arrayFavorites);
};

export const postToggleFavorite = async (req, res) => {
  const { extKeyDrink } = req.params;
  const email = res.locals.email;

  const user = await getUserByEmail(email);

  const message = await ToggleFavorite(user.id, extKeyDrink);

  res.status(200).json({ message });
};

export const getFavoriteDrink = async (req, res) => {
  const { extKeyDrink } = req.params;
  const email = res.locals.email;
  const user = await getUserByEmail(email);

  const favorite = await isFavorite(user.id, extKeyDrink);
  console.log(favorite);
  res.status(200).json(favorite);
};

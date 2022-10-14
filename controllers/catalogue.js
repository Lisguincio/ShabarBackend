import User, { getUserByEmail } from "../models/user.js";
import UserPrefs from "../models/usersprefs.js";
import { findMyDrink, findMyDrinkTemp, getDrink } from "../models/drink.js";
import Drink from "../models/drink.js";
import DispersionePreferenza from "../models/dispersionepreferenze.js";
import scelteUtente from "../models/scelteUtente.js";
import Recipe from "../models/recipe.js";
import Ingredient, {
  getIngredients,
  getIngredient,
} from "../models/ingredient.js";
import Favorite, {
  getFavoriteList,
  isFavorite,
  ToggleFavorite,
} from "../models/favorite.js";

export const fetchAllDrinks = async (req, res, next) => {
  console.log("Cerco tutti i drink...");
  const drinklist = await Drink.findAll();
  //console.log(drinklist);
  res.status(200).json(drinklist.flatMap((drink) => drink.id));
};

export const fetchDrink = async (req, res) => {
  const { extKeyDrink } = req.params;

  const drink = await getDrink(extKeyDrink);
  return res.status(200).json(drink);
};

export const fetchDrinkIngredients = async (req, res, next) => {
  const { extKeyDrink } = req.params;
  const data = getIngredients(extKeyDrink);
  console.log(data);

  res.status("200").json(data);
};

export const fetchFavorites = async (req, res) => {
  const email = res.locals.email;
  const user = await getUserByEmail(email);
  const favorites = await getFavoriteList(user.id);
  res.status(200).json(favorites);
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

export const fetchIngredient = async (req, res) => {
  const { extKeyIngredient } = req.params;
  const data = await getIngredient(extKeyIngredient);
  res.status(200).json(data);
};

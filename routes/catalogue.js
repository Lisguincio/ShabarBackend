import express from "express";
import {
  fetchDrinkIngredients,
  fetchAllDrinks,
  fetchDrink,
  fetchFavorites,
  fetchIngredient,
  postToggleFavorite,
  getFavoriteDrink,
} from "../views/catalogue/catalogue.js";
import { authorization } from "../controllers/middleware.js";

const router = express.Router();

router.get("/drinks", authorization, fetchAllDrinks);
router.get("/drink/:extKeyDrink", authorization, fetchDrink);
router.get("/drinkIngredients/:extKeyDrink", fetchDrinkIngredients);
router.get("/ingredient/:extKeyIngredient", fetchIngredient);
router.get("/favorites", authorization, fetchFavorites);
router.post("/favorite/:extKeyDrink", authorization, postToggleFavorite);
router.get("/favorite/:extKeyDrink", authorization, getFavoriteDrink);

export default router;

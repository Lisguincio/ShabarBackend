import express from "express";
import fileUpload from "express-fileupload";
import path from "path";
import ejs from "ejs";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL("..", import.meta.url));

import {
  signup,
  login,
  isAuth,
  testConnection,
  resetPassword,
  changePassword,
  updateUser,
  retriveUserInfo,
  uploadProfileImage,
  profileImage,
} from "../controllers/auth.js";
import {
  getAllDrinks as getAllDrinksBackend,
  getAllIngredients,
  inserisciRicettaHTML,
  setRecipe,
  resetRecipe,
  removerecipe,
  modificaIngrediente,
} from "../controllers/backend.js";
import { authorization } from "../controllers/middleware.js";
import Recipe from "../models/recipe.js";
import shabar, { inviaScelta, listaScelte } from "../controllers/shabar.js";
import {
  drinkIngredients,
  getAllDrinks,
  fetchDrink,
  fetchFavorites,
  postToggleFavorite,
} from "../controllers/catalogue.js";
import sequelize from "../utils/database.js";
import { calcolaValoriUtente } from "../models/scelteUtente.js";
import { getDrinkImage, getIngredientImage } from "../controllers/public.js";

const router = express.Router();

router.use(fileUpload());

//Imposta la root public come directory di file statici accessibili a tutti
router.use(express.static("public"));

//AUTH ROUTES
router.post("/login", login);
router.post("/signup", signup);
router.get("/userInfo", authorization, retriveUserInfo);
router.post("/updateUser", authorization, updateUser);
router.post("/upload-profile-image", authorization, uploadProfileImage);
router.get("/profileImage/", authorization, profileImage);
router.post("/connection", testConnection);
//richiede il reset della password tramite email
router.post("/reset-password", resetPassword);
//richiede la pagina per inserire la nuova password
router.get("/recupera-password/:token", (req, res) => {
  res.render("reset-password.ejs", { token: req.params.token });
});
//gestisce il cambiamento di password
router.post("/change-password/:token", changePassword);
router.get("/isAuth", isAuth);

//BACKEND ROUTES
router.get("/recipes", (req, res) => {
  inserisciRicettaHTML(req, res);
});
router.post("/backend/modificaricetta", setRecipe);
router.post("/backend/resetrecipe", resetRecipe);
router.post("/backend/modificaIngrediente", modificaIngrediente);
router.post("/backend/removerecipe", removerecipe);
router.get("/backend/drinks", getAllDrinksBackend);
router.get("/backend/ingredients", getAllIngredients);

//SHABAR ROUTES
router.get("/shabar", authorization, shabar);
router.get("/scelte", authorization, calcolaValoriUtente);
router.post("/inviaScelta", authorization, inviaScelta);
router.get("/listaScelte", authorization, listaScelte);

//CATALOGUE ROUTES
router.get("/drinks", authorization, getAllDrinks);
router.get("/drink/:extKeyDrink", authorization, fetchDrink);
router.get("/drinkIngredients/:extKeyDrink", drinkIngredients);
router.get("/favorites", authorization, fetchFavorites);
router.post("/favorites/:extKeyDrink", authorization, postToggleFavorite);

//BACKEND ROUTES
router.get("/register", (req, res) => {
  res.render("register.ejs");
  // res.sendFile(path.join(__dirname, "/register.html"));
});
//router.get("/admin", isAdmin);

//PUBLIC ROUTES
router.get("/images/drink/:id", getDrinkImage);
router.get("/images/ingredient/:id", getIngredientImage);

router.get("/sync", (req, res) => {
  sequelize.sync().then(() => {
    res.status(200).json({ message: "Sync success" });
  });
});

router.get("/public", (req, res, next) => {
  res.status(200).json({ message: "here is your public resource" });
});

// will match any other path
router.use("/", (req, res, next) => {
  console.log("Page not found");
  res.status(404).json({ error: "page not found" });
});

export default router;

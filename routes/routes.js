import express from "express";
import fileUpload from "express-fileupload";
import authRouter from "./auth.js";
import catalogueRouter from "./catalogue.js";

import {
  fetchAllDrinks as fetchAllDrinksBackend,
  getAllIngredients as fetchAllIngredientsBackend,
  inserisciRicettaHTML,
  setRecipe,
  resetRecipe,
  removerecipe,
  modificaIngrediente,
  inserisciIngredienteHTML,
  addIngredient as addIngredientBackend,
} from "../controllers/backend.js";
import { authorization } from "../controllers/middleware.js";
import Recipe from "../models/recipe.js";
import shabar, { postScelta, fetchScelte } from "../controllers/shabar.js";
import sequelize from "../utils/database.js";
import { calcolaValoriUtente } from "../models/scelteUtente.js";
import { getDrinkImage, getIngredientImage } from "../controllers/public.js";

const router = express.Router();

router.use(fileUpload());

router.use(authRouter);
router.use(catalogueRouter);

//BACKEND ROUTES
router.get("/recipes", (req, res) => {
  inserisciRicettaHTML(req, res);
});
router.get("/ingredients", (req, res) => {
  inserisciIngredienteHTML(req, res);
});
router.post("/backend/modificaricetta", setRecipe);
router.post("/backend/resetrecipe", resetRecipe);
router.post("/backend/modificaIngrediente", modificaIngrediente);
router.post("/backend/removerecipe", removerecipe);
router.post("/backend/addIngredient", addIngredientBackend);
router.get("/backend/drinks", fetchAllDrinksBackend);
router.get("/backend/ingredients", fetchAllIngredientsBackend);

//SHABAR ROUTES
router.get("/shabar", authorization, shabar);
router.get("/scelte", authorization, calcolaValoriUtente);
router.post("/inviaScelta/:id", authorization, postScelta);
router.get("/listascelte", authorization, fetchScelte);

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

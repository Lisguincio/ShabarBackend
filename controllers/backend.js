import Drink from "../models/drink.js";
import Ingredient from "../models/ingredient.js";
import Recipe from "../models/recipe.js";

export const fetchAllDrinks = (req, res, next) => {
  Drink.findAll().then((drinklist) => {
    //console.log(drinklist);
    drinklist.forEach((element) => {
      console.log(element.dataValues);
    });

    res.status("200").json(drinklist);
    //res.send();
  });
};

export const getAllIngredients = (req, res, next) => {
  Ingredient.findAll().then((ingredientlist) => {
    //console.log(drinklist);
    /* ingredientlist.forEach((element) => {
      console.log(element.dataValues);
    }); */

    res.status("200").json(JSON.parse(JSON.stringify(ingredientlist)));
  });
};

export const setRecipe = async (req, res) => {
  const { drink, ingredient, qty } = req.body;

  const response = Recipe.create({
    extKeyDrink: drink,
    extKeyIngredient: ingredient,
    qty: qty,
  });

  return res.status(200).json({ message: "Recipe inviata" });
};

export const removerecipe = async (req, res) => {
  const { drink, ingredient } = req.body;

  const response = await Recipe.destroy({
    where: {
      extKeyDrink: drink,
      extKeyIngredient: ingredient,
    },
  }).catch((err) => {
    return res.status(400).json({ message: "Bad Request" });
  });

  return res.status(200).json({ message: "Recipe Reset Done!" });
};
export const resetRecipe = async (req, res) => {
  const { drink } = req.body;

  const response = await Recipe.destroy({
    where: {
      extKeyDrink: drink,
    },
  }).catch((err) => {
    return res.status(400).json({ message: "Bad Request" });
  });

  const resetdrink = await Drink.update(
    {
      secco: "0",
      dolcezza: "0",
      speziato: "0",
    },
    {
      where: {
        id: drink,
      },
    }
  );

  return res.status(200).json({ message: "Recipe Reset Done!" });
};

export const inserisciRicettaHTML = async (req, res) => {
  const drinks = await Drink.findAll({});
  console.log(drinks);
  const ingredients = await Ingredient.findAll();
  res.render("Recipes.ejs", {
    drinks: drinks,
    ingredients: ingredients,
  });
};

//#region Ingredienti
export const inserisciIngredienteHTML = async (req, res) => {
  try {
    // Recupera tutti i drink e gli ingredienti dal database
    const drinks = await Drink.findAll({});
    const ingredients = await Ingredient.findAll({});

    // Renderizza il file EJS e passa i dati
    res.render("Ingredients.ejs", {
      drinks: drinks,
      ingredients: ingredients,
    });
  } catch (error) {
    console.error("Errore durante il rendering:", error);
    res.status(500).json({ message: "Errore interno del server" });
  }
};

export const addIngredient = async (req, res) => {
  console.log("Richiesta di aggiunta ingrediente ricevuta");
  const {
    name,
    multiplier,
    grade_low,
    grade_high,
    sweet,
    dry,
    spiced,
    sour,
    fizzy,
    bitter,
    herbal,
    fruity,
  } = req.body;
  console.log("Dati ricevuti:", req.body);
  try {
    const newIngredient = await Ingredient.create({
      name: name,
      multiplier: multiplier,
      grade_low: grade_low,
      grade_high: grade_high,
      sweet: sweet,
      dry: dry,
      spiced: spiced,
      sour: sour,
      fizzy: fizzy,
      bitter: bitter,
      herbal: herbal,
      fruity: fruity,
    });
    res.status(200).json({
      message: "Ingredient added successfully",
      ingredientId: newIngredient.id,
    });
  } catch (error) {
    console.error("Error adding ingredient:", error);
    res.status(500).json({ message: "Error adding ingredient" });
  }
};

export const modificaIngrediente = async (req, res) => {
  const { id_ingredient, seccoparam, dolcezzaparam, speziatoparam } = req.body;

  const OldIngredientValues = await Ingredient.findByPk(id_ingredient);

  const recipelist = await Recipe.findAll({
    where: {
      extKeyIngredient: id_ingredient,
    },
  });

  console.log(recipelist);

  const editIng = await Ingredient.update(
    {
      secco: seccoparam,
      dolcezza: dolcezzaparam,
      speziato: speziatoparam,
    },
    {
      where: {
        id: id_ingredient,
      },
    }
  ).catch((err) => {
    return res.status(400).json({ message: "Bad Request" });
  });

  if (recipelist) {
    //Se l'ingrediente modificato era utilizzato nelle ricette, bisogna modificare il sapore di tutti i drink che compaiono nella lista:

    await Promise.all(
      recipelist.map(async (elem) => {
        let drinktarget = await Drink.findOne({
          raw: true,
          where: {
            id: elem.extKeyDrink,
          },
        });

        if (drinktarget) {
          const newdolcezzaparam =
            drinktarget.dolcezza +
            ((dolcezzaparam - OldIngredientValues.dolcezza) * elem.qty) / 100;
          const newseccoparam =
            drinktarget.secco +
            ((seccoparam - OldIngredientValues.secco) * elem.qty) / 100;
          const newspeziatoparam =
            drinktarget.speziato +
            ((speziatoparam - OldIngredientValues.speziato) * elem.qty) / 100;

          const value = await Drink.update(
            {
              dolcezza: newdolcezzaparam,
              secco: newseccoparam,
              speziato: newspeziatoparam,
            },
            {
              where: {
                id: elem.extKeyDrink,
              },
            }
          );
        }
      })
    );
  }

  return res.status(200).json({ message: "Update Ingredient Done!" });
};

//#endregion

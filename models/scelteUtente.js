import { DataTypes, QueryTypes } from "sequelize";
import { Op } from "sequelize";

import sequelize from "../utils/database.js";
import DispersionePreferenza from "./dispersionepreferenze.js";
import Drink from "./drink.js";
import User, { getUserByEmail } from "./user.js";
import UserPrefs from "./usersprefs.js";
import {
  calcolaDispersionePreferenze,
  calcolaMediaPonderataDrinks,
  mediaPonderata,
  scartoQuadraticoMedio,
} from "../utils/math.js";

const sceltaUtente = sequelize.define(
  "sceltaUtente",
  {
    //column
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    extUser: {
      type: DataTypes.INTEGER,
    },
    extDrink: {
      type: DataTypes.INTEGER,
    },
  },
  {
    //options
    tableName: "scelteUtenti",
  }
);

export const createScelta = async (extUser, extDrink) => {
  await sceltaUtente.create({
    extUser,
    extDrink,
  });
  return;
};

export const getScelteUtente = async (extUser) => {
  const scelte = await sceltaUtente.findAll({
    where: { extUser },
  });

  return scelte;
};

export const calcolaValoriUtente = async (req, res) => {
  const email = res.locals.email;
  const user = await getUserByEmail(email);
  const scelte = await sceltaUtente.findAll({ where: { extUser: user.id } });

  let drinks = [];

  for (let scelta of scelte) {
    const drink = await Drink.findByPk(scelta.extDrink);
    drinks.push(drink);
  }

  const values = calcolaMediaPonderataDrinks(drinks);
  const dispersioni = calcolaDispersionePreferenze(drinks);

  res.status(200).json({ values, dispersioni });
};

sceltaUtente.afterCreate(async (scelta) => {
  const { extDrink, extUser } = scelta;
  //CERCO TUTTE LE SCELTE FATTE DALL'UTENTE
  const scelte = await sceltaUtente.findAll({
    where: {
      extUser,
    },
  });
  //console.log("scelte: ", scelte);

  //PRENDO I VALORI DEI DRINK DELLE SCELTE
  const drinks = await Drink.findAll({
    where: {
      id: scelte.flatMap((value) => value.extDrink),
    },
    attributes: { exclude: ["name", "description", "createdAt", "updatedAt"] },
  });
  //console.log("drinks: ", drinks);

  let drinkArray = [];
  scelte.forEach((scelta, index) => {
    const drinkValue = drinks.find((drink) => drink.id === scelta.extDrink); // drinkValue indica a quale drink corrisponde la index-esima scelta
    //console.log("drinkValue:", drinkValue);
    drinkArray.push(drinkValue);
  });
  drinkArray = drinkArray.map(({ id, grade_min, grade_max, ...rest }) => rest);

  //console.log("drinkArray: ", drinkArray);

  //CALCOLO LA NUOVA MEDIA PONDERATA
  const media = calcolaMediaPonderataDrinks(drinkArray);
  console.log("Nuova media: -->", media);
  //CALCOLO LA NUOVA DISPERSIONE PER OGNI VALORE
  const dispersione = calcolaDispersionePreferenze(drinkArray);
  console.log("Nuova dispersione: -->", dispersione);

  //AGGIORNO I VALORI DELLE PREFERENZE
  await UserPrefs.update(media, {
    where: { extUser },
  });
  //AGGIORNO I VALORI DELLE DISPERSIONI
  await DispersionePreferenza.update(dispersione, {
    where: { extUser },
  });
});

export default sceltaUtente;

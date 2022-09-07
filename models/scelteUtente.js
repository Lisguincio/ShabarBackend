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

/* sceltaUtente.afterCreate(async (scelta) => {
  console.log("Create scelta ->");
  const { extUser, extDrink } = scelta;

  const newValues = await Drink.findByPk(extDrink, {});

  const scelteUser = await sceltaUtente.findAll({
    //Tutte le scelte fatte dall'utente
    attributes: ["extDrink"],
    where: {
      extUser: extUser,
    },
  });

  console.log(scelteUser);

  const userPrefsMedia = await UserPrefs.findOne({
    where: {
      extUser: extUser,
    },
    attributes: { exclude: ["id", "extUser", "createdAt", "updatedAt"] },
  });

  console.log(userPrefsMedia);

  const newMedia = calcolaMediaPonderata(
    userPrefsMedia,
    scelteUser.length,
    newValues
  ); //Oggetto che detiene tutte le medie ponderate dell'utente
  console.log("newMedia -----------", newMedia);

  await UserPrefs.update(newMedia, {
    where: {
      extUser: extUser,
    },
  });

  const deviazione = calcolaDeviazioneStandard(newMedia, scelteUser, extUser);

  //2- Select delle prime n scelte;
  //3- Modifica dei valori di UserPrefs e di DispersionePreferenzas : Punti 2 e 3 demandati al trigger AfterCreate di sceltaUtentes
}); */

async function calcolaDeviazioneStandard(
  mediaPond,
  sceltaUtenteArray,
  extUser
) {
  //Scelte Utente è un array di {key:value}, che rappresenta gli id dei drink scelti dall'utente, compreso quello dell'ultima scelta
  const scelte = sceltaUtenteArray.map((scelta) => scelta["extDrink"]); //Array di indici scelti in passato, tutte values
  //console.log(scelte); /*

  //OCCORRE UNA JOIN, oppure:
  const drinksSceltiinPassato = await sequelize.query(
    `SELECT d.dolcezza, d.secco, d.speziato FROM drinks as d JOIN scelteutenti as s ON s.extDrink = d.id where s.extUser = ${extUser} `,
    { type: QueryTypes.SELECT }
  );

  /* await sceltaUtente //const drinksSceltiinPassato = await sceltaUtente.findAll({
    include: [
      {
        model: ["Drink"],
      },
    ],
    //attributes: { exclude: ["nome", "image", "createdAt", "updatedAt"] },
  });*/ /*const drinksSceltiinPassato = await Drink.findAll({
    attributes: { exclude: ["nome", "image", "updatedAt"] },
    where: {
      id: scelte,
    },
    raw: true,
  }); //Array di Object risultanti dalla query dei drink*/

  console.log("DRINK DEL PASSATO:", drinksSceltiinPassato);

  let valueSum = { dolcezza: 0, secco: 0, speziato: 0 };
  for (let index = 0; index < scelte.length; index++) {
    console.log("Iterazione per ", scelte[index]);
    // const drinkValue = drinksSceltiinPassato.find(
    //   (drink) => drink.id === scelte[index]
    //  ); // drinkValue indica a quale drink corrisponde la index-esima scelta
    const drinkValue = drinksSceltiinPassato[index];

    const temparray = Object.entries(drinkValue);
    for (const [key, value] of temparray) {
      valueSum = { ...valueSum, [key]: valueSum[key] + value };
      //Per ogni etichetta di quel drink, aggiungi l'oggetto alla somma di tutti i fattori
    }
    /*     console.log(`Per il valore di ${scelte[index]} sommo i dati}`);
    console.log(valueSum); */
  }
  console.log(valueSum);
  //console.log(drinksSceltiinPassato);
  const n = drinksSceltiinPassato.length;
  const mean = mediaPond;
  /*  let mean = { dolcezza: 0, secco: 0, speziato: 0 }; //Test con media aritmetica
  for (const [key, value] of Object.entries(valueSum)) {
    mean = { ...mean, [key]: value / n };
    //Per ogni etichetta di quel drink, aggiungi l'oggetto alla somma di tutti i fattori
  } */
  console.log(mean);

  let deviazione = { dolcezza: 0, secco: 0, speziato: 0 }; //oggetto che conterrá tutte le variazioni
  for (const [key, value] of Object.entries(mean)) {
    //dolcezza
    let summatoria = 0;
    drinksSceltiinPassato.forEach((drink) => {
      summatoria = summatoria + Math.pow(drink[key] - mean[key], 2);
    });
    console.log("n: ", n);
    const dev = Math.sqrt(summatoria / n);
    console.log("dev:", dev);
    /* const valore = Math.sqrt(
      drinksSceltiinPassato
        .map((x) => Math.pow(x - value, 2))
        .reduce((a, b) => a + b) / n
    );*/
    deviazione = { ...deviazione, [key]: dev };
  }
  console.log("deviazione", deviazione);

  console.log("END");

  console.log("OUT");
  console.log(deviazione);
  await DispersionePreferenza.update(
    {
      d_dolcezza: deviazione.dolcezza,
      d_secco: deviazione.secco,
      d_speziato: deviazione.speziato,
    },
    {
      where: { extUser: extUser },
    }
  );
  return deviazione;
}

export default sceltaUtente;

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

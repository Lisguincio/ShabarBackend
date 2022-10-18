import { getUserByEmail } from "../models/user.js";
import UserPrefs from "../models/usersprefs.js";
import DispersionePreferenza from "../models/dispersionepreferenze.js";
import scelteUtente, {
  createScelta,
  getScelteUtente,
} from "../models/scelteUtente.js";
import { Op } from "sequelize";

const shabar = async (req, res) => {
  //Prelevare l 'email dal token,
  const email = res.locals.email;
  //Cercare l'id utente
  const user = await getUserByEmail(email);
  const id = user.id;
  //Cercare l'utente nella tabella usersprefs,
  const prefs = await UserPrefs.findOne({
    where: { extUser: id },
    attributes: { exclude: ["id", "extUser", "createdAt", "updatedAt"] },
  });
  //console.log("preferenze utente", prefs);

  //Trovo i valori adatti al confronto
  let offset = 0;
  //Trovo i ranges
  const ranges = await DispersionePreferenza.findOne({
    where: { extUser: id },
    attributes: { exclude: ["id", "extUser", "createdAt", "updatedAt"] },
  });

  let shabarDrinks = [];
  /* let rangestemp = {
    d_dolcezza: ranges.dolcezza,
    dol_value: prefs.dolcezza,
    d_secco: ranges.secco,
    sec_value: prefs.secco,
    d_speziato: ranges.speziato,
    spe_value: prefs.speziato,
  }; */
  let rangesTemp = { values: {}, ranges: {} };
  Object.entries(prefs).forEach(([key, value]) => {
    //console.log(key, value);
    rangesTemp.values[key] = value;
    rangesTemp.ranges[key] = ranges[key] < 0.5 ? 0.5 : ranges[key];
  });
  console.log("rangesTemps", rangesTemp);

  while (shabarDrinks.length < 3) {
    //Cerco i drink che soddisfano i ranges
    console.log("cerco con offset: ", offset);
    const tempDrinks = await Drink.findAll({
      where: {
        //[dolcezza: 2.42, 2.52]
        [Op.and]: Object.entries(rangesTemp.values).map(([key, value]) => {
          const min = value - (rangesTemp.ranges[key] + offset);
          const max = value + (rangesTemp.ranges[key] + offset);
          console.log(`min ${key}`, min);
          console.log(`max ${key}`, max);
          return {
            [key]: {
              [Op.between]: [min, max],
            },
          };
        }),
      },
    });
    console.log("tempDrinks", tempDrinks);
    if (tempDrinks.length > 0) {
      tempDrinks.forEach((element) => {
        if (!shabarDrinks.find((drink) => drink.id == element.id)) {
          console.log(element.id, "non esiste");
          shabarDrinks.push(element);
        }
      });
    }
    offset += 0.5;
  }

  //console.log("shabarDrinks", shabarDrinks);

  //const arrayRangeTemp = Object.entries(rangestemp);
  //console.log("ArrayRangeTemp: ", arrayRangeTemp);
  //const arrayRange = Manage(arrayRangeTemp);
  //let { min1, min2 } = GetMaxfromRange(arrayRange);

  //console.log(arrayRange);
  //console.log(min1);
  //console.log(min2);

  //Una volta ottenute le sue preferenze, cercare tra i drink quello che lo soddisfa

  /* const { drinkstemp, iterazioni } = await findMyDrinkTemp(
    min1,
    min2,
    moltiplicatore,
    prefs
  );
  console.log(iterazioni);
  //moltiplicatore = 1;
  let drinks = await findMyDrink(ranges, moltiplicatore, prefs, iterazioni);
  console.log("drinks-out:", drinks);

  if (drinks.length === 0) drinks = drinkstemp; */
  shabarDrinks = shabarDrinks.slice(0, 10);
  console.log("shabar: ", shabarDrinks);
  res.status(200).json(shabarDrinks);
};

/* function Manage(arrayRangeTemp) {
  let array = [];
  for (let i = 0; i < arrayRangeTemp.length; i += 2) {
    array.push([
      arrayRangeTemp[i][0],
      arrayRangeTemp[i][1],
      arrayRangeTemp[i + 1][1],
    ]);
  }

  return array;
}

function GetMaxfromRange(arrayRange) {
  let min1 = ["key", 11, 0],
    min2 = ["key", 11, 0];
  arrayRange.forEach((element) => {
    if (element[1] < min1[1]) {
      if (min1[1] < min2[1]) min2 = min1;
      min1 = element;
    } else if (element != min1 && element[1] < min2[1]) {
      min2 = element;
    }
  });

  return { min1, min2 };
} */

export const postScelta = async (req, res) => {
  const { id } = req.params;
  //L'utente segnala al server la scelta fatta (da precisare quando)
  //2- Select delle prime n scelte;
  //3- Modifica dei valori di UserPrefs e di DispersionePreferenzas : Punti 2 e 3 demandati al trigger AfterCreate di scelteutentes
  const email = res.locals.email;
  const user = await getUserByEmail(email);
  console.log("l utente ", user.id, "ha effettuato una nuova scelta:", id);
  await createScelta(user.id, id);
  res.status(200).json({ message: "Scelta ricevuta!" });
};

export const fetchScelte = async (req, res) => {
  const email = res.locals.email;
  const utente = await getUserByEmail(email);
  const scelte = await getScelteUtente(utente.id);

  console.log(scelte);

  const array = scelte.map((scelta) => ({
    drink: scelta.extDrink,
    dataScelta: scelta.createdAt,
  }));

  //console.log(array);

  res.status(200).json(array);
};

export default shabar;

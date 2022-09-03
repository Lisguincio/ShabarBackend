import User from "../models/user.js";
import UserPrefs from "../models/usersprefs.js";
import Drink, { findMyDrink, findMyDrinkTemp } from "../models/drink.js";
import DispersionePreferenza from "../models/dispersionepreferenze.js";
import scelteUtente from "../models/scelteUtente.js";

const shabar = async (req, res) => {
  //Prelevare l 'email dal token,
  const email = res.locals.email;
  //Cercare l'id utente
  const user = await User.findOne({ where: { email: email } });
  const id = user.id;
  //Cercare l'utente nella tabella usersprefs,
  let prefs = await UserPrefs.findOne({
    where: { extUser: id },
  });
  console.log(prefs);
  //Trovo i valori adatti al confronto
  let moltiplicatore = 1;

  //Trovo i ranges
  let ranges = await DispersionePreferenza.findOne({
    where: { extUser: id },
  });

  let rangestemp = {
    d_dolcezza: ranges.d_dolcezza,
    dol_value: prefs.dolcezza,
    d_secco: ranges.d_secco,
    sec_value: prefs.secco,
    d_speziato: ranges.d_speziato,
    spe_value: prefs.speziato,
  };

  const arrayRangeTemp = Object.entries(rangestemp);
  console.log("ArrayRangeTemp: ", arrayRangeTemp);
  const arrayRange = Manage(arrayRangeTemp);
  let { min1, min2 } = GetMaxfromRange(arrayRange);

  //console.log(arrayRange);
  console.log(min1);
  console.log(min2);

  //Una volta ottenute le sue preferenze, cercare tra i drink quello che lo soddisfa

  const { drinkstemp, iterazioni } = await findMyDrinkTemp(
    min1,
    min2,
    moltiplicatore,
    prefs
  );
  console.log(iterazioni);
  moltiplicatore = 1;
  let drinks = await findMyDrink(ranges, moltiplicatore, prefs, iterazioni);
  console.log("drinks-out:", drinks);

  if (drinks.length === 0) drinks = drinkstemp;
  console.log("shabar: ", drinks);
  res.status(200).json(drinks);
};

function Manage(arrayRangeTemp) {
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
}

export const inviaScelta = async (req, res) => {
  //L'utente segnala al server la scelta fatta (da precisare quando)
  //2- Select delle prime n scelte;
  //3- Modifica dei valori di UserPrefs e di DispersionePreferenzas : Punti 2 e 3 demandati al trigger AfterCreate di scelteutentes

  const email = res.locals.email;
  const { idDrink } = req.body;

  const utente = await User.findOne({
    where: {
      email: email,
    },
  });

  console.log("l utente ", utente.id, "ha effettuato una nuova scelta");
  scelteUtente.create({
    extUser: utente.id,
    extDrink: idDrink,
  });
  res.status(200).json({ message: "Scelta ricevuta!" });
};

export const listaScelte = async (req, res) => {
  const email = res.locals.email;

  const utente = await User.findOne({
    where: { email: email },
  });

  const scelte = await scelteUtente.findAll({
    where: { extUser: utente.id },
  });

  console.log(scelte);

  let drinkArray = [];

  for (let scelta of scelte) {
    const drink = await Drink.findByPk(scelta.extDrink, {});
    drinkArray.push({ drink: drink, dataScelta: scelta.createdAt });
  }

  console.log(drinkArray);

  res.status(200).json(drinkArray);
};

export default shabar;

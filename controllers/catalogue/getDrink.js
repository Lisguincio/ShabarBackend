import Drink from "../../models/drink.js";
import getIngredients from "./getIngredients.js";

const getDrink = async (extKeyDrink) => {
  let drink = {};
  //INFORMAZIONE DEL DRINK
  const drinkInfo = await Drink.findByPk(extKeyDrink);

  drink = {
    id: drinkInfo.id,
    name: drinkInfo.name,
    image: drinkInfo.image,
    description: drinkInfo.description,
  };
  //VALORI DEL DRINK
  drink.values = {
    secco: drinkInfo.secco,
    speziato: drinkInfo.speziato,
    dolcezza: drinkInfo.dolcezza,
  };

  drink.ingredients = await getIngredients(extKeyDrink);

  //console.log(drink);
  return drink;
};

export default getDrink;

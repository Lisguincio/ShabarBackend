import Drink from "../../models/drink.js";

const fetchAllDrinks = async () => {
  const drinks = await Drink.findAll();
  //console.log(drinklist);
  return drinks.flatMap((drink) => drink.id);
};

export default fetchAllDrinks;

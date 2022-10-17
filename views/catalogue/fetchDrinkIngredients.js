import getIngredients from "../../controllers/catalogue/getIngredients.js";

const fetchDrinkIngredients = async (req, res) => {
  try {
    const { extKeyDrink } = req.params;
    const ingredients = await getIngredients(extKeyDrink);
    res.status(200).json(ingredients);
  } catch (error) {
    console.error("error:", error);
    res.status(error.status || 500).json({ message: error.message });
  }
};

export default fetchDrinkIngredients;

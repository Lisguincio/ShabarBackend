import getIngredient from "../../controllers/catalogue/getIngredient.js";

const fetchIngredient = async (req, res) => {
  try {
    const { extKeyIngredient } = req.params;
    const ingredient = await getIngredient(extKeyIngredient);
    res.status(200).json(ingredient);
  } catch (error) {
    console.error("error:", error);
    res.status(error.status || 500).json({ message: error.message });
  }
};

export default fetchIngredient;

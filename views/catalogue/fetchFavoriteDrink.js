import getFavoriteDrink from "../../controllers/catalogue/getFavoriteDrink.js";

const fetchFavoriteDrink = async (req, res) => {
  try {
    const { extKeyDrink } = req.params;
    const email = res.locals.email;
    const response = await getFavoriteDrink(extKeyDrink, email);
    res.status(200).json(response);
  } catch (error) {
    console.error("error:", error);
    res.status(error.status || 500).json({ message: error.message });
  }
};

export default fetchFavoriteDrink;

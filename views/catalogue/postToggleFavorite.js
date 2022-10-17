import toggleFavorite from "../../controllers/catalogue/toggleFavorite.js";

const postToggleFavorite = async (req, res) => {
  try {
    const { extKeyDrink } = req.params;
    const email = res.locals.email;

    const message = await toggleFavorite(extKeyDrink, email);
    res.status(200).json({ message });
  } catch (error) {
    console.error("error:", error);
    res.status(error.status || 500).json({ message: error.message });
  }
};

export default postToggleFavorite;

import getFavorites from "../../controllers/catalogue/getFavorites.js";

const fetchFavorites = async (req, res) => {
  try {
    const email = res.locals.email;
    const favorites = await getFavorites(email);
    res.status(200).json(favorites);
  } catch (error) {
    console.error("error:", error);
    res.status(error.status || 500).json({ message: error.message });
  }
};

export default fetchFavorites;

import Favorite from "../../models/favorite.js";
import { getUserByEmail } from "../../models/user.js";

const getFavoriteDrink = async (extKeyDrink, email) => {
  const user = await getUserByEmail(email);
  const isFavorite =
    (await Favorite.findOne({
      where: { extKeyUser: user.id, extKeyDrink },
    })) !== null;
  return isFavorite;
};

export default getFavoriteDrink;

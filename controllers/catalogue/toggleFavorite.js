import Favorite from "../../models/favorite.js";
import { getUserByEmail } from "../../models/user.js";

const toggleFavorite = async (extKeyDrink, email) => {
  const user = await getUserByEmail(email);
  const favorite = await Favorite.findOne({
    where: { extKeyUser: user.id, extKeyDrink },
  });
  if (favorite) {
    await Favorite.destroy({ where: { id: favorite.id } });
    return "Removed";
  } else {
    await Favorite.create({ extKeyUser: user.id, extKeyDrink });
    return "Added";
  }
};

export default toggleFavorite;

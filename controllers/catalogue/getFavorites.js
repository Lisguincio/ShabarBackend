import { getUserByEmail } from "../../models/user.js";
import Favorite from "../../models/favorite.js";

const getFavorites = async (email) => {
  const user = await getUserByEmail(email);
  const list = await Favorite.findAll({
    where: { extKeyUser: user.id },
  });
  const result = list.map((item) => item.extKeyDrink);
  return result;
};

export default getFavorites;

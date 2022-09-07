import Drink from "../models/drink.js";
import { downloadFile } from "../GCloud/GC_Storage.js";

export const getDrinkImage = async (req, res) => {
  const { id } = req.params;
  const drink = await Drink.findByPk(id);
  const path = "public/images/Drinks/" + drink.name + ".png";
  res.writeHead(200, {
    "Content-Type": "image/jpg;",
  });

  const file = await downloadFile(path, res);
};

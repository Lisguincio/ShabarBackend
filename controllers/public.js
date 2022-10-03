import Drink from "../models/drink.js";
import Ingredient from "../models/ingredient.js";
import s3 from "../utils/storage.js";

const getPublicImage = async (path, res) => {
  const params = {
    Bucket: "public",
    Key: `/images${path}`,
  };
  try {
    const data = await s3.getObject(params).promise();
    res.header("Content-Type", "image/png");
    res.send(data.Body);
  } catch (err) {
    console.log("richiesto url: ", params.Key);
    console.log(err);
    res.status(err.statusCode).send(err.code);
  }
};

export const getDrinkImage = async (req, res) => {
  const { id } = req.params;
  await getPublicImage(`/Drinks/${id}.png`, res);
  return;
};

export const getIngredientImage = async (req, res) => {
  const { id } = req.params;
  await getPublicImage(`/Ingredienti/${id}.png`, res);
  return;
};

import getDrink from "../../controllers/catalogue/getDrink.js";

const fetchDrink = async (req, res) => {
  try {
    const { extKeyDrink } = req.params;
    const drink = await getDrink(extKeyDrink);
    res.status(200).json(drink);
  } catch (error) {
    console.error("error:", error);
    res.status(error.status || 500).json({ message: error.message });
  }
};

export default fetchDrink;

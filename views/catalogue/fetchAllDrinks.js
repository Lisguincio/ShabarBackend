import fetchAllDrinksFunction from "../../controllers/catalogue/fetchAllDrinks.js";

const fetchAllDrinks = async (req, res) => {
  try {
    console.log("Cerco tutti i drink...");
    const result = await fetchAllDrinksFunction();
    res.status(200).json(result);
  } catch (error) {
    console.error("error:", error);
    res.status(error.status || 500).json({ message: error.message });
  }
};

export default fetchAllDrinks;

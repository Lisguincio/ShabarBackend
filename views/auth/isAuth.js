import isAuthFunction from "../../controllers/auth/isAuth.js";

const isAuth = async (req, res, next) => {
  try {
    // Prelevo il token dall'header
    const authHeader = req.get("Authorization");
    //Se non c'è l' authorization nell'header
    if (!authHeader) throw { status: 401, message: "Non autorizzato" };
    //Prelevo il token
    const token = authHeader.split(" ")[1];
    const result = await isAuthFunction(token);
    res.status(200).json(result);
  } catch (error) {
    console.log("error:", error);
    res.status(error.status || 502).json({ message: error.message });
  }
};

export default isAuth;

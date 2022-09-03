import jwt from "jsonwebtoken";

export const authorization = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "not authenticated" });
  }
  const token = authHeader.split(" ")[1]; //remove Bearer
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SECRETKEYTOKEN);
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "could not decode the token" });
  }
  if (!decodedToken) {
    res.status(401).json({ message: "unauthorized" });
  } else {
    console.log("Utente autorizzato: ", decodedToken.email);
    res.locals.email = decodedToken.email;
    next();
  }
};

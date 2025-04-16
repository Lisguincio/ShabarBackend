import jwt from "jsonwebtoken";

import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const isAuth = async (token) => {
  //Decodifico il token
  const decodedToken = jwt.verify(token, process.env.SECRETKEYTOKEN);
  //Se il token descodificato non è valido
  if (!decodedToken) throw { status: 401, message: "Non autorizzato" };
  //Confermo che l'utente è autenticato
  return { message: "Autorizzato" };
};

export default isAuth;

import { getUserByEmail } from "../../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const login = async (email, password) => {
  // Controllo che l'utente esista
  const user = await getUserByEmail(email);
  //Se l'utente non esiste
  if (!user) throw { status: 401, message: "Utente non trovato" };
  //Cripto la password
  const result = await bcrypt.compare(password, user.password);
  //Se le credenziali non sono valide
  if (!result) throw { status: 401, message: "Credenziali non valide" };
  //Creo il token
  console.log(process.env.SECRETKEYTOKEN);
  const token = jwt.sign({ email: user.email }, process.env.SECRETKEYTOKEN);
  // Converto l'utente in un oggetto semplice
  const userData = user.get({ plain: true });
  // Rimuovo la password dall'oggetto semplice
  delete userData.password;
  // Ritorno l'utente e il token
  return { token: token, ...userData };
};

export default login;

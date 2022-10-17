import { getUserByEmail } from "../../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
  const token = jwt.sign({ email: user.email }, process.env.SECRETKEYTOKEN);
  //Rimuovo la password tra le proprietà dell'utente
  delete user.password;
  //Ritorno l'utente e il token
  return { token: token, ...user };
};

export default login;

import User, { getUserByEmail } from "../../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const signup = async (email, password) => {
  /* 
    Signup response API:
      - 200: all OK!
      - 400: email/password not provided
      - 409: email already exist
      - 500: Couldn't hash the password
      - 502: Generic error create user 
  */
  //Prelevo l'utente dal database
  const user = await getUserByEmail(email);
  //Se l'utente esiste già
  if (user) throw { status: 409, message: "Email già registrata" };
  //Se le credenziali non sono state fornite
  // password hash
  const passwordHash = await bcrypt.hash(password, 12);
  //Se non riesco a hashare la password
  if (!passwordHash) throw { status: 500, message: "Errore hash password" };
  //Creo l'utente
  const userCreated = await User.create({
    email,
    password: passwordHash,
    role: 1,
  });
  //Creo il token
  const token = jwt.sign({ email }, process.env.SECRETKEYTOKEN);
  //Rimuovo la password tra le proprietà dell'utente
  delete userCreated.password;
  //Ritorno l'utente creato e il token
  return { token: token, ...userCreated.dataValues };
};

export default signup;

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../../models/user.js";

const changePassword = async (token, password) => {
  /*
  Cambia la password dell'utente
  */

  //Decodifico la mail dal token
  const email = jwt.verify(token, process.env.SECRETRESETTOKEN).email;
  //Cripto la nuova password
  const hashedPass = await bcrypt.hash(password, 12);
  //Aggiorno l'utente
  const numRow = await User.update(
    { password: hashedPass },
    { where: { email } }
  );
  //Se non ho aggiornato nessun utente
  if (numRow == 0) {
    throw { status: 498, message: "Invalid Token" };
  }
  //Ritorno il messaggio di successo
  return { message: "Password cambiata correttamente" };
};

export default changePassword;

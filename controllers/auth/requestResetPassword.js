import { getUserByEmail } from "../../models/user.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utils/mailSender.js";

import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const requestResetPassword = async (email) => {
  /*
  Richiede l'email dell'utente e invia una mail con un link per resettare la password
  */
  const user = await getUserByEmail(email);
  if (!user) throw { status: 401, message: "Utente non trovato" };
  const token = jwt.sign({ email: user.email }, process.env.SECRETRESETTOKEN);
  const mailResponse = await sendEmail(user.email, "Reset Password", {
    title: "Cambia ora la tua password",
    body: `Ciao, hai richiesto un reset della password, clicca su questo pulsante per reimpostare la password`,
    button_main_text: "Clicca qui per cambiare la tua password",
    button_main_link: `https://${process.env.RAILWAY_STATIC_URL}/recupera-password/${token}`,
  });
  return mailResponse;
};

export default requestResetPassword;

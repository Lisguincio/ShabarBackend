import requestResetPasswordFunction from "../../controllers/auth/requestResetPassword.js";

/*
Richiede l'email dell'utente e invia una mail con un link per resettare la password
*/
const requestResetPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const result = await requestResetPasswordFunction(email);
    console.log("mail inviata");
    res.status(200).json(result);
  } catch (error) {
    console.error("error:", error);
    res.status(error.status || 500).json({ message: error.message });
  }
};

export default requestResetPassword;

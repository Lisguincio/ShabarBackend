import changePasswordFunction from "../../controllers/auth/changePassword.js";

//Cambia la password dell'utente

const changePassword = async (req, res) => {
  try {
    //Prelevo la password dal body ed il token dall'url
    const { password } = req.body;
    const { token } = req.params;
    //Se la password non è stata fornita
    if (!password)
      throw {
        status: 401,
        message: "Il campo delle password non puó essere vuoto",
      };
    const result = await changePasswordFunction(token, password);
    //Ritorno il messaggio di successo
    res.status(200).json(result);
  } catch (error) {
    console.error("error:", error);
    res.status(error.status || 500).json({ message: error.message });
  }
};

export default changePassword;

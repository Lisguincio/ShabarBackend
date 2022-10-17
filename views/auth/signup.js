import signup from "../../controllers/auth/signup.js";

const signupFunction = async (req, res) => {
  /* 
    Signup response API:
      - 200: all OK!
      - 400: email/password not provided
      - 409: email already exist
      - 500: Couldn't hash the password
      - 502: Generic error create user 
  */
  try {
    //Pulisco l'email
    const email = req.body.email.trim();
    const password = req.body.password;
    //Prelevo l'utente dal database
    if (!email || !password)
      throw { status: 400, message: "Email e password non fornite" };
    const result = await signup(email, password);
    res.status(200).json(result);
  } catch (error) {
    console.log("error:", error);
    res.status(error.status || 500).json({ message: error.message });
  }
};

export default signupFunction;

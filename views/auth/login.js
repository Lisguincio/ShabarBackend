import loginFunction from "../../controllers/auth/login.js";

const login = async (req, res) => {
  /* 
    Login response API:
      - 200: all OK!
      - 400: email/password not provided
      - 401: user not found / invalid credentials
      - 502: Generic error checking password 
  */
  try {
    const email = req.body.email.trim();
    const password = req.body.password;
    const result = await loginFunction(email, password);
    res.status(200).json(result);
  } catch (error) {
    console.error("error:", error);
    res.status(error.status || 500).json({ message: error.message });
  }
};

export default login;

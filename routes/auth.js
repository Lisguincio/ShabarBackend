import express from "express";
import {
  signup,
  login,
  isAuth,
  requestResetPassword,
  changePassword,
  /* updateUser,
  retriveUserInfo, */
  postProfileImage,
  getProfileImage,
} from "../views/auth/auth.js";
import { authorization } from "../controllers/middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
/* router.get("/userInfo", authorization, retriveUserInfo);
router.post("/updateUser", authorization, updateUser); */
router.post("/upload-profile-image", authorization, postProfileImage);
router.get("/profileImage/", authorization, getProfileImage);
//richiede il reset della password tramite email
router.post("/reset-password", requestResetPassword);
//richiede la pagina per inserire la nuova password
router.get("/recupera-password/:token", (req, res) => {
  res.render("reset-password.ejs", { token: req.params.token });
});
//gestisce il cambiamento di password
router.post("/change-password/:token", changePassword);
router.get("/isAuth", isAuth);

export default router;

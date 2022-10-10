import bcrypt from "bcryptjs";
import jwt, { decode } from "jsonwebtoken";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL("..", import.meta.url));

import User, { getUserByEmail } from "../models/user.js";
import s3 from "../utils/storage.js";
import sendEmail from "./sendEmail.js";

/* 
  Signup response API:
    - 200: all OK!
    - 400: email/password not provided
    - 409: email already exist
    - 500: Couldn't hash the password
    - 502: Generic error create user 
*/

const signup = (req, res) => {
  // checks if email already exists
  //console.log(req);

  User.findOne({
    where: {
      email: req.body.email.trim(),
    },
  })
    .then((dbUser) => {
      if (dbUser) {
        return res.status(409).json({ message: "Account giá registrato" });
      } else if (req.body.email && req.body.password) {
        // password hash
        bcrypt.hash(req.body.password, 12, (err, passwordHash) => {
          if (err) {
            return res.status(500).json({ message: "Password non ammessa" });
          } else if (passwordHash) {
            return User.create({
              email: req.body.email,
              name: req.body.name,
              password: passwordHash,
              role: 1,
            })
              .then(() => {
                const token = jwt.sign(
                  { email: req.body.email },
                  process.env.SECRETKEYTOKEN
                );
                res
                  .status(200)
                  .json({ token: token, message: "Utente creato" });
              })
              .catch((err) => {
                console.log(err);
                res
                  .status(502)
                  .json({ message: "Errore durante la creazione dell'utente" });
              });
          }
        });
      } else if (!req.body.email) {
        return res.status(400).json({ message: "Email non fornita" });
      } else if (!req.body.password) {
        return res.status(400).json({ message: "Password non fornita" });
      }
    })
    .catch((err) => {
      console.log("error", err);
    });
};

/* 
  Login response API:
    - 200: all OK!
    - 400: email/password not provided
    - 401: user not found / invalid credentials
    - 502: Generic error checking password 
*/

const login = (req, res, next) => {
  console.log(req.body.password);
  // checks if email exists
  User.findOne({
    where: {
      email: req.body.email.trim(),
    },
  })
    .then(async (dbUser) => {
      if (!dbUser) {
        return res.status(401).json({ message: "Utente non trovato" });
      } else {
        //user exist
        // password hash
        const result = await bcrypt.compare(req.body.password, dbUser.password);

        if (!result) {
          res.status(401).json({ message: "invalid credentials" });
        } else {
          const token = jwt.sign(
            { email: dbUser.email },
            process.env.SECRETKEYTOKEN
          );
          delete dbUser.password;
          res.status(200).json({ token: token, ...dbUser });
        }
        /* bcrypt.compare(req.body.password, dbUser.password, (err, success) => {
          if (err) {
            // error while comparing
            res
              .status(502)
              .json({ message: "error while checking user password" });
          } else if (success) {
            // password match
            //token generation
            const token = jwt.sign(
              { email: req.body.email },
              process.env.SECRETKEYTOKEN
            );
            //console.log(token);
            res.status(200).json({ message: "user logged in", token: token });
          } else {
            // password doesnt match
            res.status(401).json({ message: "invalid credentials" });
          }
        }); */
      }
    })
    .catch((err) => {
      console.log("error", err);
    });
};

const isAuth = (req, res, next) => {
  const authHeader = req.get("Authorization");
  //console.log(req);
  if (!authHeader) {
    return res.status(401).json({ message: "not authenticated" });
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SECRETKEYTOKEN);
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "could not decode the token" });
  }
  if (!decodedToken) {
    res.status(401).json({ message: "unauthorized" });
  } else {
    console.log("Token autorizzato");
    res.status(200).json({ message: "Autorizzato" });
  }
};

const testConnection = (req, res, next) => {
  EmailSender(req.body.email, "Reset Password", "12345");
  res.status(200).json({ message: "inviato" });
};

const resetPassword = async (req, res, next) => {
  //console.log(req.body.email);
  // checks if email exists
  const dbUser = await getUserByEmail(req.body.email);

  if (!dbUser) {
    return res.status(401).json({ message: "Utente non trovato" });
  } else {
    console.log("esiste l'utente");
    const token = jwt.sign({ email: dbUser.email }, process.env.SECRETKEYTOKEN);
    sendEmail(dbUser.email, "Reset Password", {
      title: "Cambia ora la tua password",
      body: `Ciao, hai richiesto un reset della password, clicca su questo pulsante per reimpostare la password`,
      button_main_text: "Clicca qui per cambiare la tua password",
      button_main_link: `https://${process.env.RAILWAY_STATIC_URL}/recupera-password/${token}`,
    }).then(
      (ok) => {
        return res.status(200).json({ message: "Controlla casella di posta" });
      },
      (error) => {
        return res.status(404).json({ message: err });
      }
    );
  }
};

const changePassword = async (req, res) => {
  const { password } = req.body;
  console.log(password);
  const { token } = req.params;

  if (password === "") {
    return res
      .status(401)
      .json({ message: "Il campo password non puó essere vuoto" });
  }
  //console.log(password);
  const email = jwt.decode(token).email;
  const hashedPass = await bcrypt.hash(password.trim(), 12);
  console.log(
    "La password é: " + password + "; La password criptata é: " + hashedPass
  );
  const numRow = await User.update(
    {
      password: hashedPass,
    },
    {
      where: {
        email: email,
      },
    }
  );

  if (numRow === 0) {
    res.status(498).json({ message: "Invalid Token" });
  } else
    return res.status(200).json({
      message: "Password cambiata correttamente",
    });
};

const updateUser = async (req, res) => {
  const emailToken = res.locals.email;

  const UsertoUpdate = req.body;
  const dbUser = await getUserByEmail(emailToken);

  if (!dbUser) {
    return res.status(401).json({ message: "Utente non trovato" });
  } else {
    await User.update(UsertoUpdate, {
      where: {
        email: emailToken,
      },
    });
    return res.status(200).json({ message: "Utente aggiornato" });
  }
};

const retriveUserInfo = async (req, res) => {
  const email = res.locals.email;
  const user = await getUserByEmail(email);
  delete user.password; //nascondo la password

  res.status(200).json(user);
};

const uploadProfileImage = async (req, res) => {
  const email = res.locals.email;
  const user = await getUserByEmail(email);
  const { id } = user;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: "No files were uploaded." });
  }

  const file = req.files.file;

  const path = "./uploads/images/" + `profile_${id}.jpg`;

  console.log(file);

  const params = {
    Bucket: "profile",
    Key: `${id}.jpg`,
    Body: file.data,
  };

  await s3
    .upload(params, {
      partSize: 64 * 1024 * 1024,
    })
    .promise();

  /* await User.update(
    {
      profileIMG: `/profileImage/profile_${id}.jpg`,
    },
    {
      where: { id: id },
    }
  ); */

  return res.status(200).json({ message: "Immagine caricata" });
};

const profileImage = async (req, res) => {
  const email = res.locals.email;
  console.log("richiesta immagine del profilo per:", email);
  const user = await getUserByEmail(email);
  try {
    const data = await s3
      .getObject({
        Bucket: "profile",
        Key: `${user.id}.jpg`,
      })
      .promise();

    res.header("Content-Type", "image/png");
    res.send(data.Body);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Immagine non trovata" });
  }
};

export {
  signup,
  login,
  isAuth,
  testConnection,
  resetPassword,
  changePassword,
  updateUser,
  retriveUserInfo,
  uploadProfileImage,
  profileImage,
};

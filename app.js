import express from "express";
import cors from "cors";

import sequelize from "./utils/database.js";
import router from "./routes/routes.js";
import User from "./models/user.js";
import Drink from "./models/drink.js";

const app = express();

app.set("view engine", "ejs");
app.set("views", "./templates");
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.set("view engine", "ejs");

// Configura CORS
app.use(
  cors({
    origin: "http://127.0.0.1:5000", // Sostituisci con l'origine del tuo frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Metodi consentiti
    allowedHeaders: ["Content-Type", "Authorization"], // Intestazioni consentite
  })
);

app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(router);

sequelize.sync().catch((error) => {
  console.log(error);
});

app.listen(process.env.PORT || 5000);

export default app;

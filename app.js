import express from "express";

import sequelize from "./utils/database.js";
import router from "./routes/routes.js";
import User from "./models/user.js";
import Drink from "./models/drink.js";

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.set("view engine", "ejs");

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

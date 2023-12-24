const db = require("../database/database");
const userModel = require("../models/user_model");
const checkAuth = (req, res, next) => {
  try {
    let row = "";
    if (process.env.TEST === "true") {
      if (process.env.TESTMAIL === undefined) {
        res.status(403).render("forOFor", {
          status: 403,
          errorText: "Korisnik nije ulogiran",
          link: "/login",
        });
        return;
      }
      row = db
      .prepare(userModel.getUserByEmail)
      .get({ email: process.env.TESTMAIL });
    } else {
      row = db
      .prepare(userModel.getUserByToken)
      .get({ token: req.session.token });
    }
    if (!row) {
      //res.status(404).send("User not logged in");
      res.status(403).render("forOFor", {
        status: 403,
        errorText: "Korisnik nije ulogiran",
        link: "/login",
      });
    } else {
      if (row.is_admin !== undefined)
      if (row.is_admin === 1) {
        req.session.is_admin = true;
      } else {
        req.session.is_admin = false;
      }
      req.session.user_id = row.id;

      next();
    }
  } catch (err) {
    console.error(err);
    res.render("forOFor", {
      status: 500,
      errorText: "Internal Server Error: " + err.message,
      link: "/login",
    });
  }
};

module.exports = checkAuth;

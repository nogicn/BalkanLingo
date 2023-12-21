const user = require("../models/user_model");
const db = require("../database/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
var sendEmail = require("../middleware/mail_middleware");

// create a new user
function createUser(req, res) {
  // check if incoming request is coming from localhost
  const { name, surname, email } = req.body;
  try {
    // create random string for password
    const password = Math.random().toString(36).slice(-8);
    //const hash = bcrypt.hashSync(password, salt);
    const result = db
      .prepare(user.createUser)
      .run({ name: name, surname: surname, email: email, password: password });
    if (result.changes !== 0) {
      sendEmail(email, password);
      res.render("resetPassNotif", { title: "Register" });
    } else {
      res.redirect("/login");
    }
  } catch (err) {
    console.error(err);
    res.status(404).send("User not created " + err.message);
  }
}

// login a user
function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    var pass = db.prepare(user.getUserByEmail).get({ email: email });
    if (!pass) {
      res.status(404).send("User not found");
    }
    pass = pass.password;
    if (password != pass) {
      const hash = bcrypt.hashSync(password, salt);
      const row = db
        .prepare(user.loginEmailPassword)
        .get({ email: email, password: hash });
      if (!row) {
        res.status(404).send("User not found");
      } else {
        req.session.token = null;
        const token = jwt.sign(
          { mail: req.body.email },
          "iamaverystrongsecretyesyes?"
        );
        const update = db
          .prepare(user.updateTokenByEmail)
          .get({ token: token, email: email });
        if (update.changes !== 0) {
          req.session.token = token;
          req.session.email = email;
          req.session.name = update.name;
          req.session.surname = update.surname;
          req.session.is_admin = update.is_admin == 1 ? true : false;
          //res.json(update);
          res.redirect("/dashboard");
        }
      }
    } else {
      res.render("createPass", { email: email });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error: " + err.message);
  }
}

function logoutUser(req, res) {
  let checkToken = db
    .prepare(user.getUserByToken)
    .get({ token: req.session.token });

  if (checkToken.id == undefined) {
    res.status(302).send("Error no token");
    return;
  }

  let update = db
    .prepare(user.updateTokenByEmail)
    .run({ token: null, email: req.session.email });

  if (update.changes == 0) {
    res.status(302).send("Error");
    return;
  }

  const cookies = req.cookies;

  for (const cookieName in cookies) {
    if (cookies.hasOwnProperty(cookieName)) {
      // Set each cookie's expiration date to a date in the past
      res.cookie(cookieName, "", { expires: new Date(0), path: "/" });
    }
  }
  req.session.destroy();
  res.redirect("/");
}
//Get all users
function getAllUsers(req, res) {
  try {
    const rows = db.prepare(user.getAllUsers).all();
    result = JSON.stringify(rows);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(404).send("Users not found " + err);
  }
}

function resetPwd(req, res) {
  const { email } = req.body;
  try {
    const row = db.prepare(user.getUserByEmail).get({ email: email });
    if (!row) {
      res.status(404).send("User not found");
    } else {
      // create random string for password
      const password = Math.random().toString(36).slice(-8);
      const result = db
        .prepare(user.updatePasswordByEmail)
        .run({ email: email, password: password });
      if (result.changes !== 0) {
        sendEmail(email, password);
        res.render("resetPassNotif", { title: "Register" });
      } else {
        res.redirect("/login");
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error: " + err.message);
  }
}

function editUser(req, res) {
  const { name, surname } = req.body;
  try {
    const update = db
      .prepare(user.updateUserByToken)
      .run({ name: name, surname: surname, token: req.session.token });
    if (update.changes !== 0) {
      req.session.name = name;
      req.session.surname = surname;
      res.redirect("/user/edit");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error: " + err.message);
  }
}

function createPass(req, res) {
  const { email, password, password2 } = req.body;
  try {
    if (password != password2) {
      res.status(404).send("Passwords do not match");
    } else {
      const hash = bcrypt.hashSync(password, salt);
      const result = db
        .prepare(user.updatePasswordByEmail)
        .run({ email: email, password: hash });
      const row = db
        .prepare(user.loginEmailPassword)
        .get({ email: email, password: hash });
      const token = jwt.sign({ mail: email }, "iamaverystrongsecretyesyes?");
      const update = db
        .prepare(user.updateTokenByEmail)
        .get({ token: token, email: email });
      if (update.changes !== 0) {
        req.session.token = token;
        req.session.email = email;
        req.session.name = update.name;
        req.session.surname = update.surname;
        req.session.is_admin = update.is_admin == 1 ? true : false;
        //res.json(update);
        res.redirect("/dashboard");
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error: " + err.message);
  }
}

// export all functions
module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  logoutUser,
  resetPwd,
  editUser,
  createPass,
};

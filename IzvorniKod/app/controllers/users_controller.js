const user = require("../models/user_model");
const db = require("../database/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const dictionaryController = require("../controllers/dictionary_controller");
const ejs = require("ejs");
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
    res.status(404);
    res.render("forOFor", {status: 500, errorText: "Greška pri kreiranju korisnika!", link: "/login"});
  }
}

// login a user
async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    var pass = db.prepare(user.getUserByEmail).get({ email: email });
    if (!pass) {
      res.status(404);
      res.render("forOFor", { status: 404, errorText: "Greška kod prijave korisnika!", link: "/login" })
    }
    pass = pass.password;
    if (password != pass) {
      const hash = await bcrypt.compare(password, pass)
      console.log(hash);
      
      if (!hash) {
        res.status(404);
        res.render("forOFor", { status: 404, errorText: "Greška kod prijave korisnika!", link: "/login" })

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
          //dictionaryController.dashboard(req, res);
          res.redirect("/dashboard");
        }
      }
    } else {
      res.render("createPass", { email: email });
    }
  } catch (err) {
    console.error(err);
    res.status(500);
    res.render("forOFor", {status: 500, errorText: "Greška pri prijavi korisnika!", link: "/login"});
  }
}

function logoutUser(req, res) {
  let checkToken = db
    .prepare(user.getUserByToken)
    .get({ token: req.session.token });

  if (checkToken.id == undefined) {
    res.status(302);
    res.render("forOFor", {status: 302, errorText: "Error no token!", link: "/login"});
    return;
  }

  let update = db
    .prepare(user.updateTokenByEmail)
    .run({ token: null, email: req.session.email });

  if (update.changes == 0) {
    res.status(302);
    res.render("forOFor", {status: 302, errorText: "Greška!", link: "/login"});
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

async function setAdmin(req, res) {
  const id = req.params.id;
  try {
    let a = db.prepare(user.getUserById).get({ id: id });
    console.log(a);
    if (a.is_admin == 1) {

    }
    let result = db.prepare(user.setAdminByEmail).get({ email: a.email });
    if (result.changes !== 0) {
      let html = await ejs.renderFile('views/partials/userRow.ejs', { users: result }); 
      res.send(html)
    } else {
      
    }
  } catch (err) {
    console.error(err);
    res.status(500);
    res.render("forOFor", {status: 500, errorText: "Greška!", link: "/login"});
  }
}

function searchUsers(req, res) {
  const { name, surname, email } = req.body;
  try {
    
    const rows = db.prepare(user.getAllUsers).all();
    res.render("userSearch", { title: "Search users", users: rows });    
  } catch (err) {
    res.status(404)
    res.render("forOFor", {status: 404, errorText: "Greška! Korisnik nije pronađen." + err, link: "/dashboard"})
  }
}

async function listUsers(req, res) {
  if (req.headers['hx-request'] == 'true') {
    const rows = db.prepare(user.getUserLikeEmail).all({ email: req.body.email + '%' });
    let html = await ejs.renderFile(
      "views/partials/userList.ejs",
      { users: rows }
    );
    res.send(html);
  }
}

function resetPwd(req, res) {
  const { email } = req.body;
  try {
    const row = db.prepare(user.getUserByEmail).get({ email: email });
    if (!row) {
      res.status(404);
      res.render("forOFor", {status: 404, errorText: "Korisnik nije pronađen!", link: "/login"});
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
    res.status(500);
    res.render("forOFor", {status: 500, errorText: "Greška pri promjeni lozinke!", link: "/login"});

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
    res.status(500);
    res.render("forOFor", {status: 500, errorText: "Greška!", link: "/login"});
  }
}

async function createPass(req, res) {
  const { email, password, password2 } = req.body;
  try {
    if (password != password2) {
      res.status(404);
      res.render("forOFor", {status: 404, errorText: "Lozinke se ne podudaraju!", link: "/login"});

    } else {
      //console.log(salt);
      const hash = await bcrypt.hash(password, saltRounds)
      console.log(hash);
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
    res.status(500);
    res.render("forOFor", {status: 500, errorText: "Greška!", link: "/login"});

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
  searchUsers,
  listUsers,
  setAdmin
};

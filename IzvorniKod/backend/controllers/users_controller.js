const user = require('../models/user_model');
const db = require('../database/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// create a new user
function createUser(req, res) {
    const { name, surname, email, password } = req.body;
    console.log(name, surname, email, password);
    try {
        const result = db.prepare(user.createUser).run(name, surname, email, "password");
        console.log(result.lastInsertRowid);
        //res.json(result.lastInsertRowid);
        res.render('resetPassNotif', { title: 'Register' });
    } catch (err) {
        console.error(err);
        res.status(404).send("User not created " + err.message);
    }
}

// login a user
function loginUser(req, res) {
    const { email, password } = req.body;
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const row = db.prepare(user.loginEmailPassword).get(email, hash);
        if (!row) {
            console.log("User not found");
            res.status(404).send("User not found");
        } else {
            req.session.token = null;
            const token = jwt.sign({'mail':req.body.email}, 'iamaverystrongsecretyesyes?');
            console.log(token);
            const update = db.prepare(user.updateTokenByEmail).get(token, email);
            if (update.changes !== 0) {
                req.session.token = token;
                req.session.email = email;
                console.log(update);
                //res.json(update);
                res.render('landingPage', { title: 'BalkanLinGO' });
            }
        }
      } catch (err) {
            console.error(err);
            res.status(500).send("Internal Server Error: " + err.message);
      }
}


function logoutUser(req, res) {
    let checkToken = db.prepare(user.getUserByToken).get(req.session.token)
    console.log(checkToken);
    if (checkToken.id == undefined) {
        res.status(302).send("Error no token");
        return;
    }
    let update = db.prepare(user.updateTokenByEmail).run(null, req.session.email);
    if (update.changes == 0) {
        res.status(302).send("Error");
        return;
    }
    req.session.token = null;
    req.session.email = null;
    //res.json(update);
    res.redirect('/');
}   

//Get all users
function getAllUsers(req, res) {
    try {
        const rows = db.prepare(user.getAllUsers).all();
        console.log(rows);
        result = JSON.stringify(rows);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(404).send("Users not found "+ err);
    }
}

function resetPwd(req, res) {
    const { email, password, password2 } = req.body;
    console.log(email, password, password2);
    try {
        const row = db.prepare(user.getUserByEmail).get(email);
        if (!row) {
            console.log("User not found");
            res.status(404).send("User not found");
        } else {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            const update = db.prepare(user.updatePasswordByEmail).run(hash, email);
            if (update.changes !== 0) {
                console.log(update);
                res.render('login', { title: 'Login' });
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
    resetPwd
}

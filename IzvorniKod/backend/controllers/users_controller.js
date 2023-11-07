const user = require('../models/user_model');
const db = require('../database/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);

// create a new user
function createUser(req, res) {
    // check if incoming request is coming from localhost
    if (req.hostname !== 'localhost') {
        const { name, surname, email, password } = req.body;
        //console.log(name, surname, email, password);
        try {
            const hash = bcrypt.hashSync(password, salt);
            const result = db.prepare(user.createUser).run({name:name, surname:surname, email:email, password:hash});
        } catch (err) {
            console.error(err);
            res.status(404).send("User not created " + err.message);
        }
    }else {
        const { name, surname, email } = req.body;
        //console.log(name, surname, email, password);
        try {
            // create random string for password
            const password = Math.random().toString(36).slice(-8);
            const hash = bcrypt.hashSync(password, salt);
            const result = db.prepare(user.createUser).run({name:name, surname:surname, email:email, password:hash});
            if (result.changes !== 0) {
                console.log(result);
                res.render('resetPassNotif', { title: 'Register' });
            }else{
                res.redirect('/login');
            }
        } catch (err) {
            console.error(err);
            res.status(404).send("User not created " + err.message);
        }
    }
}

// login a user
function loginUser(req, res) {
    const { email, password } = req.body;
    try {
        
        const hash = bcrypt.hashSync(password, salt);
        const row = db.prepare(user.loginEmailPassword).get({email:email, password:hash});
        console.log(row);
        if (!row) {
            console.log("User not found");
            res.status(404).send("User not found");
        } else {
            req.session.token = null;
            const token = jwt.sign({'mail':req.body.email}, 'iamaverystrongsecretyesyes?');
            console.log(token);
            const update = db.prepare(user.updateTokenByEmail).get({token:token, email:email})
            if (update.changes !== 0) {
                req.session.token = token;
                req.session.email = email;
                console.log(update);
                //res.json(update);
                res.redirect('/');
            }
        }
      } catch (err) {
            console.error(err);
            res.status(500).send("Internal Server Error: " + err.message);
      }
}


function logoutUser(req, res) {
    let checkToken = db.prepare(user.getUserByToken).get({ token: req.session.token });
    console.log(checkToken);

    if (checkToken.id == undefined) {
        res.status(302).send("Error no token");
        return;
    }

    let update = db.prepare(user.updateTokenByEmail).run({ token: null, email: req.session.email });

    if (update.changes == 0) {
        res.status(302).send("Error");
        return;
    }

    const cookies = req.cookies;

    for (const cookieName in cookies) {
        if (cookies.hasOwnProperty(cookieName)) {
            console.log(cookieName, cookies[cookieName]);
        // Set each cookie's expiration date to a date in the past
        res.cookie(cookieName, '', { expires: new Date(0), path: '/' });
        }
    }
    req.session.destroy();
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
        const row = db.prepare(user.getUserByEmail).get({email:email});
        if (!row) {
            console.log("User not found");
            res.status(404).send("User not found");
        } else {
            
            const hash = bcrypt.hashSync(password, salt);
            const update = db.prepare(user.updatePasswordByEmail).run({password:hash, email:email})
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
    resetPwd,
}

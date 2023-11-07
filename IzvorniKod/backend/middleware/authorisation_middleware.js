const db = require('../database/database');
const users = require('../models/user_model');

const checkAuth = (req, res, next) => {
    try {
        const row = db.prepare(users.getUserByToken).get(req.session.token);
        if (!row) {
            console.log("User not logged in");
            res.status(404).send("User not logged in");
            //res.redirect('/login');
        } else {
            next();
        }
    }
    catch (err) {
            console.error(err);
            res.status(500).send("Internal Server Error: " + err.message);
    }
}

module.exports = checkAuth;

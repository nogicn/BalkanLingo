const db = require('../database/database');
const users = require('../models/user_model');

const checkAuth = (req, res, next) => {
    try {
        const row = db.prepare(users.getUserByToken).get({token:req.session.token});
        // if user is not logged in and current page is not home page
        if (!row && req.originalUrl !== '/' ) {
            //console.log("User not logged in");
            //res.status(404).send("User not logged in");
            res.redirect('/');
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

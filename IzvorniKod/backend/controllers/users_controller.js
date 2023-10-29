const users = require('../database/users_db');
const db = require('../database/database');

// create a new user
function createUser(req, res) {
    const { name, surname, email, password, role } = req.body;
    console.log(name, surname, email, password, role);
    db.run(users.createUser, [name, surname, email, password, role], function(err) {
        if (err) {
            console.log(err);
            res.send("User not created "+ err).status(404);
        }
        console.log(this.lastID);
        res.json(this.lastID);
    });
}

// login a user
function loginUser(req, res) {
    const { email, password } = req.body;
    db.get(users.loginEmailPassword, [email, password], function(err, row) {
        if (row == undefined || err) {
            console.log(err);
            res.send("User not found "+ err).status(404);
        }
        console.log(row);
        result = JSON.stringify(row);
        res.json(result);
    });
}

//Get all users
function getAllUsers(req, res) {
    db.all(users.getAllUsers, function(err, rows) {
        if (err) {
            console.log(err);
            res.send("Users not found "+ err).status(404);
        }
        console.log(rows);
        result = JSON.stringify(rows);
        res.json(result);
    });
}

// export all functions
module.exports = {
    createUser,
    loginUser,
    getAllUsers
}
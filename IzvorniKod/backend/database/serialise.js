const userModel = require('../models/users_model');
const { createUser } = require('./users_db');
const db = require('./database');

function migration(){
    db.serialize(function() {
        db.run(userModel.createUserTable);
        db.run("INSERT INTO user (name, surname, email, password, admin) VALUES (?, ?, ?, ?, ?)", ["Admin", "Admin", "admin@gmail.com", "admin", true]);
        db.run("INSERT INTO user (name, surname, email, password, admin) VALUES (?, ?, ?, ?, ?)", ["User", "User", "user@gmail.com", "user", false]);
        console.log("Migration complete")
    }
    );
    db.all("SELECT * FROM user", function(err, rows) {
        rows.forEach(function (row) {
            console.log(row);
        })
    });
}

exports.migration = migration;

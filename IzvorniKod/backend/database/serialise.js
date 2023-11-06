const userModel = require('../models/user_model');
const db = require('./database');

function migration(){
    db.prepare(userModel.createUserTable).run();
    db.prepare(userModel.createUserWithRole).run(["Admin", "Admin", "admin@gmail.com", "admin", 1]);
    db.prepare(userModel.createUserWithRole).run(["User", "User", "user@gmail.com", "user", 0]);
    console.log("Migration complete")
}


exports.migration = migration;

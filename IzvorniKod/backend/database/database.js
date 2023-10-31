const sqlite3 = require('sqlite3').verbose();
const userModel = require('../models/user_model');

//const db = new sqlite3.Database('./database.db');
const db = new sqlite3.Database(':memory:');



module.exports = db;
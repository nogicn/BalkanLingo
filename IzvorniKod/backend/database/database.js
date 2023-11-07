const sqlite3 = require('better-sqlite3');
const userModel = require('../models/user_model');

//const db = new sqlite3('./database/database.sqlite3', { verbose: console.log });

const db = new sqlite3(':memory:', { verbose: console.log });




module.exports = db;
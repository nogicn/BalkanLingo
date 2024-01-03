const sqlite3 = require('better-sqlite3');
const userModel = require('../models/user_model');
const fs = require('fs');

const dbFile = './database/database.sqlite3';

// delete database file if exists

if (process.env.MIGRATE === 'true') {
    if (fs.existsSync(dbFile)) {
        fs.unlinkSync(dbFile);
    }  
}
if (process.env.MIGRATE === 'reset') {
    if (fs.existsSync(dbFile)) {
        fs.unlinkSync(dbFile);
    }  
    // copy database file from backup
    fs.copyFileSync('./database/testDB.sqlite3', './database/database.sqlite3');
}

var db = ""
if (process.env.TEST === 'true') {
    if (fs.existsSync('./database/testDBTEMP.sqlite3')) {
        fs.unlinkSync('./database/testDBTEMP.sqlite3');
    }
        fs.copyFileSync('./database/testDB.sqlite3', './database/testDBTEMP.sqlite3');
     db = new sqlite3('./database/testDBTEMP.sqlite3', {  });

}else{
     db = new sqlite3('./database/database.sqlite3', {  });
}


//const db = new sqlite3(':memory:', { verbose: console.log });




module.exports = db;
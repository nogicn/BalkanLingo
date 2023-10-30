const db = require('../database/database');

const createUserTable = `
    CREATE TABLE user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        surname VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(64) NOT NULL,
        admin BOOLEAN NOT NULL
    )`;

module.exports = {
    createUserTable
}



const db = require('../database/database');

const createUserTable = `
    CREATE TABLE user
    (
        id INT NOT NULL,
        name INT NOT NULL,
        surname INT NOT NULL,
        email INT NOT NULL,
        password INT NOT NULL,
        is_admin INT NOT NULL,
        PRIMARY KEY (id),
        UNIQUE (email)
    );
    `;

module.exports = {
    createUserTable
}



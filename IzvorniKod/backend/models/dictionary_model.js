const db = require('../database/database');

const createDictionaryTable = `
    CREATE TABLE dictionary
    (
        id INT NOT NULL,
        name INT NOT NULL,
        language INT NOT NULL,
        PRIMARY KEY (id)
    );
    `;

module.exports = {
    createDictionaryTable
}
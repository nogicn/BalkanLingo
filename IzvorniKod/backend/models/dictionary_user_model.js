const db = require('../database/database');

const createDictionaryUserTable = `
    CREATE TABLE dictionary_user (
    id INT NOT NULL,
    user_id INT NOT NULL,
    dictionary_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (dictionary_id) REFERENCES dictionary(id)
    );
    `;

module.exports = {
    createDictionaryUserTable
}
const db = require('../database/database');

const createUserWordTable = `
    CREATE TABLE user_word (
        id INT NOT NULL,
        last_answered INT,
        delay INT,
        active INT NOT NULL,
        word_id INT NOT NULL,
        user_id INT NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (word_id) REFERENCES word(id),
        FOREIGN KEY (user_id) REFERENCES user(id),
    );
    `;

module.exports = {
    createUserWordTable
}
const db = require('../database/database');

const createActiveQuestionTable = `
    CREATE TABLE active_question (
        id INT NOT NULL,
        type INT NOT NULL,
        user_id INT NOT NULL,
        word_id INT NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES user(id),
        FOREIGN KEY (word_id) REFERENCES word(id),
        UNIQUE (user_id)
    )
    `;

module.exports = {
    createActiveQuestionTable
}
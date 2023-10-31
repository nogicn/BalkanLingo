const db = require('../database/database');

const createWordTable = `
    CREATE TABLE word
    (
        id INT NOT NULL,
        foreign_word INT NOT NULL,
        foreign_description INT NOT NULL,
        nativeWord INT NOT NULL,
        nativeDescription INT NOT NULL,
        pronounciation INT NOT NULL,
        dictionary_id INT NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (dictionary_id) REFERENCES dictionary(id),
        UNIQUE (foreign_word),
        UNIQUE (foreign_description),
        UNIQUE (pronounciation),
        UNIQUE (dictionary_id)
    );
    `;

module.exports = {
	createWordTable
}
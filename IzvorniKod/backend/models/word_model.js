const db = require('../database/database');

const createWordTable = `
    CREATE TABLE word (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        foreign_word TEXT NOT NULL,
        foreign_description TEXT NOT NULL,
        nativeWord TEXT NOT NULL,
        nativeDescription TEXT NOT NULL,
        pronounciation TEXT NOT NULL,
        dictionary_id INTEGER NOT NULL,
        FOREIGN KEY (dictionary_id) REFERENCES dictionary(id),
        UNIQUE (foreign_word, foreign_description, nativeWord, nativeDescription, dictionary_id)
    );
`;

const createWord = `
    INSERT INTO word (foreign_word, foreign_description, nativeWord, nativeDescription, pronounciation, dictionary_id) VALUES (@foreignWord, @foreignDescription, @nativeWord, @nativeDescription, @pronounciation, @dictionaryId);
`;

const deleteWordById = `
    DELETE FROM word WHERE id = @wordId;
`;

const deleteWordByMeaning = `
    DELETE FROM word WHERE foreign_word = @foreignWord AND foreign_description = @foreignDescription AND nativeWord = @nativeWord AND nativeDescription = @nativeDescription;
`;

module.exports = {
    createWordTable,
    createWord,
    deleteWordById,
    deleteWordByMeaning
}
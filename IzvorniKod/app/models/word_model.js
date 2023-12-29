const createWordTable = `
    CREATE TABLE word (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        foreignWord TEXT NOT NULL,
        foreignDescription TEXT NOT NULL,
        nativeWord TEXT NOT NULL,
        nativeDescription TEXT NOT NULL,
        pronunciation TEXT NOT NULL,
        dictionary_id INTEGER NOT NULL,
        FOREIGN KEY (dictionary_id) REFERENCES dictionary(id),
        UNIQUE (foreignWord, foreignDescription, nativeWord, nativeDescription, dictionary_id)
    );
`;

const createWord = `
    INSERT INTO word (foreignWord, foreignDescription, nativeWord, nativeDescription, pronunciation, dictionary_id) VALUES (@foreignWord, @foreignDescription, @nativeWord, @nativeDescription, @pronunciation, @dictionaryId);
`;

const deleteWordById = `
    DELETE FROM word WHERE id = @wordId;
`;

const deleteWordByMeaning = `
    DELETE FROM word WHERE foreign_word = @foreignWord AND foreignDescription = @foreignDescription AND nativeWord = @nativeWord AND nativeDescription = @nativeDescription;
`;

const getWordByDictionaryId = `
    SELECT * FROM word WHERE dictionary_id = @dictionaryId;
`;

const deleteWordByDictionaryId = `
    DELETE FROM word WHERE dictionary_id = @dictionaryId;
`;

const getAllWords = `
    SELECT * FROM word;
`;

const getWordById = `
    SELECT * FROM word WHERE id = @wordId;
`;

const updateWord = `
    UPDATE word SET foreignWord = @foreignWord, foreignDescription = @foreignDescription, nativeWord = @nativeWord, nativeDescription = @nativeDescription, pronunciation = @pronunciation WHERE id = @wordId;
`;

const searchWordByDictionaryId = `
    SELECT * FROM word WHERE dictionary_id = @dictionaryId AND (foreignWord LIKE '%' || @word || '%' OR nativeWord LIKE '%' || @word || '%');
`;

const getAllWordsNotInUserWord = `
    SELECT * FROM word WHERE id NOT IN (SELECT word_id FROM user_word WHERE user_id = @userId);
`;

module.exports = {
    createWordTable,
    createWord,
    deleteWordById,
    deleteWordByMeaning,
    getWordByDictionaryId,
    deleteWordByDictionaryId,
    getAllWords,
    getWordById,
    updateWord,
    searchWordByDictionaryId,
    getAllWordsNotInUserWord,
}
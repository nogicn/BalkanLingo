const createDictionaryUserTable = `
    CREATE TABLE dictionary_user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        dictionary_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES user(id),
        FOREIGN KEY (dictionary_id) REFERENCES dictionary(id)
    );
`;

const addDictionaryToUser = `
    INSERT INTO dictionary_user (user_id, dictionary_id) VALUES (@userId, @dictionaryId);
`;

const deleteDictionaryFromUser = `
    DELETE FROM dictionary_user WHERE user_id = @userId AND dictionary_id = @dictionaryId;
`;

module.exports = {
    createDictionaryUserTable,
    addDictionaryToUser,
    deleteDictionaryFromUser
}
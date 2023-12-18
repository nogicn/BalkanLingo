const createDictionaryTable = `
    CREATE TABLE dictionary (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        language_id INTEGER NOT NULL,
        image_link TEXT NOT NULL,
        FOREIGN KEY (language_id) REFERENCES language(id)
    );
`;

const createNewDictionary = `
    INSERT INTO dictionary (name, language_id, image_link) VALUES (@name, @language_id, @imageLink);
`;

const getDictionariesForUser = `
    SELECT dictionary.*
    FROM dictionary, dictionary_user
    WHERE dictionary.id = dictionary_user.dictionary_id
    AND dictionary_user.user_id = @userId;
`;

const getAllDictionaries = `
    SELECT *
    FROM dictionary;
`;

const deleteDictionary = `
    DELETE FROM dictionary
    WHERE dictionary.id = @id;
`;

const getDictionariesNotAssignedToUser = `
    SELECT dictionary.*
    FROM dictionary
    WHERE dictionary.id NOT IN (
        SELECT dictionary_id
        FROM dictionary_user
        WHERE user_id = @userId
    );
`;

const getDictionaryById = `
    SELECT *
    FROM dictionary
    WHERE id = @id;
`;

module.exports = {
    createDictionaryTable,
    createNewDictionary,
    getDictionariesForUser,
    getAllDictionaries,
    deleteDictionary,
    getDictionariesNotAssignedToUser,
    getDictionaryById

}
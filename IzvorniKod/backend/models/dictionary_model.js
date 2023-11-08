const createDictionaryTable = `
    CREATE TABLE dictionary (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name INTEGER NOT NULL,
        language TEXT NOT NULL,
        image_link TEXT NOT NULL,
        flag_icon_link TEXT NOT NULL
    );
`;

const createNewDictionary = `
    INSERT INTO dictionary (name, language, image_link, flag_icon_link) VALUES (@name, @language, @imageLink, @flagIconLink);
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

module.exports = {
    createDictionaryTable,
    createNewDictionary,
    getDictionariesForUser,
    getAllDictionaries
}
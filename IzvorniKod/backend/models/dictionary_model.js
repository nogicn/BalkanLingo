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
    FROM dictionary, user_dictionary
    WHERE dictionary.id = user_dictionary.dictionary_id
    AND user_dictionary.user_id = @userId;
`;

module.exports = {
    createDictionaryTable,
    createNewDictionary,
    getDictionariesForUser
}